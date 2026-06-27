const { metaWebhookVerifyToken } = require('../_lib/config');
const { normalizePhone } = require('../_lib/phone');
const { sendRsvpConfirmed, sendRsvpDeclined, sendCardCountSelection } = require('../_lib/meta');
const { getGuestByPhone, getGuestByMetaMessageId, updateGuest, insertMessage, logTimeline, logWebhookEvent } = require('../_lib/supabase');

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}
function mapButtonId(message) {
  if (message.type === 'interactive' && message.interactive?.type === 'button_reply') {
    return message.interactive.button_reply.id;
  }
  if (message.type === 'button') {
    const payload = String(message.button?.payload || message.button?.text || '').toLowerCase();
    if (payload.includes('اعتذر') || payload.includes('أعتذر') || payload.includes('decline') || payload.includes('عذر')) return 'btn_decline';
    if (payload.includes('ارغب') || payload.includes('أرغب') || payload.includes('confirm') || payload.includes('حضور')) return 'btn_confirm';
  }
  return '';
}

async function findGuestForMessage(phoneNumber, contextMessageId) {
  let guest = null;
  if (contextMessageId) guest = await getGuestByMetaMessageId(contextMessageId);
  if (!guest) guest = await getGuestByPhone(phoneNumber);
  return guest;
}

async function processButton(message) {
  const phoneNumber = normalizePhone(message.from);
  const buttonId = mapButtonId(message);
  const contextMessageId = message.context?.id;
  if (!buttonId || buttonId === 'btn_unknown') return;

  const guest = await findGuestForMessage(phoneNumber, contextMessageId);
  await logWebhookEvent('rsvp_button_press', { phoneNumber, buttonId, contextMessageId, found: !!guest });
  if (!guest) return;

  const cardsCount = Number(guest.cardsCount || 1);
  if (buttonId === 'btn_decline') {
    await updateGuest(guest.id, {
      rsvpStatus: 'declined', confirmedCount: 0, declinedCount: cardsCount, pendingCount: 0, repliedAt: new Date().toISOString()
    });
    await insertMessage({ bookingId: guest.bookingId, guestId: guest.id, phoneNumber, direction: 'inbound', messageType: 'button', messageBody: 'أعتذر عن الحضور', status: 'received' });
    await logTimeline(guest, 'rsvp_declined', { cardsCount }, 'meta');
    await sendRsvpDeclined(phoneNumber);
    return;
  }

  if (buttonId === 'btn_confirm' && cardsCount > 1) {
    await updateGuest(guest.id, { rsvpStatus: 'pending', pendingCount: cardsCount, repliedAt: new Date().toISOString() });
    await insertMessage({ bookingId: guest.bookingId, guestId: guest.id, phoneNumber, direction: 'inbound', messageType: 'button', messageBody: 'أرغب في الحضور - بانتظار عدد البطاقات', status: 'received' });
    await logTimeline(guest, 'rsvp_confirm_requested_count', { cardsCount }, 'meta');
    await sendCardCountSelection(phoneNumber, guest.guestName, cardsCount);
    return;
  }

  await updateGuest(guest.id, {
    rsvpStatus: 'confirmed', confirmedCount: 1, declinedCount: 0, pendingCount: 0, repliedAt: new Date().toISOString()
  });
  await insertMessage({ bookingId: guest.bookingId, guestId: guest.id, phoneNumber, direction: 'inbound', messageType: 'button', messageBody: 'أرغب في الحضور', status: 'received' });
  await logTimeline(guest, 'rsvp_confirmed', { confirmedCount: 1 }, 'meta');
  await sendRsvpConfirmed(phoneNumber);
}

async function processListReply(message) {
  if (!(message.type === 'interactive' && message.interactive?.type === 'list_reply')) return;
  const phoneNumber = normalizePhone(message.from);
  const selectedId = message.interactive.list_reply.id || '';
  const match = selectedId.match(/card_count_(\d+)/);
  if (!match) return;
  const selectedCount = Number(match[1]);
  const guest = await findGuestForMessage(phoneNumber, message.context?.id);
  await logWebhookEvent('card_count_selected', { phoneNumber, selectedId, selectedCount, found: !!guest });
  if (!guest) return;
  const cardsCount = Number(guest.cardsCount || 1);
  const confirmedCount = Math.max(0, Math.min(selectedCount, cardsCount));
  const declinedCount = Math.max(0, cardsCount - confirmedCount);
  await updateGuest(guest.id, {
    rsvpStatus: 'confirmed', confirmedCount, declinedCount, pendingCount: 0, repliedAt: new Date().toISOString()
  });
  await insertMessage({ bookingId: guest.bookingId, guestId: guest.id, phoneNumber, direction: 'inbound', messageType: 'list_reply', messageBody: `تأكيد ${confirmedCount} من ${cardsCount}`, status: 'received' });
  await logTimeline(guest, 'rsvp_confirmed_count', { confirmedCount, declinedCount, cardsCount }, 'meta');
  await sendRsvpConfirmed(phoneNumber);
}

async function processStatus(status) {
  const messageId = status.id;
  const phoneNumber = normalizePhone(status.recipient_id);
  let guest = await getGuestByMetaMessageId(messageId);
  if (!guest) guest = await getGuestByPhone(phoneNumber);
  if (!guest) return;
  const updates = {};
  const current = guest.rsvpStatus;
  const canMarkMessageState = !['confirmed', 'declined', 'checked-in'].includes(current);
  if (status.status === 'delivered') {
    updates.deliveredAt = new Date().toISOString();
    if (canMarkMessageState) updates.rsvpStatus = 'delivered';
  }
  if (status.status === 'read') {
    updates.readAt = new Date().toISOString();
    if (canMarkMessageState) updates.rsvpStatus = 'read';
  }
  if (status.status === 'failed') updates.rsvpStatus = 'failed';
  if (Object.keys(updates).length) await updateGuest(guest.id, updates);
  await logTimeline(guest, `message_${status.status}`, { messageId, status }, 'meta');
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge') || '';
    if (mode === 'subscribe' && token === metaWebhookVerifyToken) return send(res, 200, challenge);
    return send(res, 403, 'Forbidden');
  }

  if (req.method !== 'POST') return send(res, 405, 'Method not allowed');

  // Meta needs a fast 200. Processing here is still lightweight for Vercel.
  const body = await readBody(req);
  send(res, 200, 'OK');

  try {
    await logWebhookEvent('meta_webhook_raw', body);
    if (body.object !== 'whatsapp_business_account') return;
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        for (const message of value.messages || []) {
          await processListReply(message);
          await processButton(message);
        }
        for (const status of value.statuses || []) await processStatus(status);
      }
    }
  } catch (error) {
    console.error('[webhook/meta] Error', error);
    await logWebhookEvent('meta_webhook_error', { error: String(error.message || error), body });
  }
};
