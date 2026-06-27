function normalizePhone(input) {
  let value = String(input || '').trim();
  value = value.replace(/[^0-9+]/g, '');
  if (value.startsWith('+')) value = value.slice(1);
  if (value.startsWith('00')) value = value.slice(2);
  value = value.replace(/\D/g, '');
  if (/^[279]\d{7}$/.test(value)) value = `968${value}`;
  return value;
}

module.exports = { normalizePhone };
