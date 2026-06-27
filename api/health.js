const { metaAccessToken, metaPhoneNumberId, supabaseUrl, supabaseServiceRoleKey } = require('./_lib/config');
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({
    ok: true,
    metaConfigured: Boolean(metaAccessToken && metaPhoneNumberId),
    supabaseConfigured: Boolean(supabaseUrl && supabaseServiceRoleKey),
    webhookPath: '/api/webhook/meta'
  }));
};
