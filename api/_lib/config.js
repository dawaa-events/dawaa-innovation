// DAWAA Events runtime configuration
// This file is intentionally able to work even if Vercel Environment Variables are not added yet.
// Environment Variables still override these fallback values.

const get = (...names) => {
  for (const name of names) {
    if (process.env[name]) return process.env[name];
  }
  return '';
};

module.exports = {
  metaApiVersion: get('META_API_VERSION') || 'v25.0',
  metaAccessToken: get('META_ACCESS_TOKEN'),
  metaPhoneNumberId: get('META_PHONE_NUMBER_ID', 'PHONE_NUMBER_ID') || '1234484883073247',
  wabaId: get('WABA_ID') || '958419667221605',
  // Meta verification must match the token typed in Meta Developers.
  metaWebhookVerifyToken: get('META_WEBHOOK_VERIFY_TOKEN', 'VERIFY_TOKEN') || 'dawaa2026',
  supabaseUrl: get('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL') || 'https://ibdnpxaxbjawvfacqjfr.supabase.co',
  supabaseAnonKey: get('SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: get('SUPABASE_SERVICE_ROLE_KEY'),
  defaultTemplateName: get('META_INVITATION_TEMPLATE') || 'dawaa_wedding_invitation',
  defaultLanguage: get('META_TEMPLATE_LANGUAGE') || 'ar',
  templateParameterMode: get('META_TEMPLATE_PARAMETER_MODE') || 'auto',
  sendApiToken: get('DAWAA_SEND_API_TOKEN', 'INTERNAL_API_TOKEN')
};
