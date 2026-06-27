# Dawaa Events - Setup & Deployment Instructions

## Overview

Dawaa Events is a complete WhatsApp-based event management platform for sending wedding and party invitations, tracking guest responses, and managing check-ins.

This document covers:
1. Environment setup
2. Database configuration
3. n8n workflow integration
4. Meta WhatsApp Cloud API setup
5. Deployment
6. Testing checklist

---

## 1. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# OAuth
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# JWT
JWT_SECRET=your_jwt_secret_key

# Owner Info
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Name

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# Built-in APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im/v1
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/v1

# WhatsApp / Meta Configuration
PHONE_NUMBER_ID=1234484883073247
META_BUSINESS_ACCOUNT_ACCESS_TOKEN=your_meta_access_token
VERIFY_TOKEN=dawaa2026

# n8n
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/whatsapp/send-invitations
```

---

## 2. Database Setup

### Supabase Configuration

1. Create a Supabase project at https://supabase.com
2. Get your connection string from the project settings
3. Update `DATABASE_URL` in `.env.local`

### Run Migrations

The database schema has already been created with all necessary tables:

- `users` - User accounts
- `bookings` - Event bookings
- `guests` - Guest lists
- `messages` - Message history
- `message_status_logs` - WhatsApp delivery status
- `webhook_logs` - Webhook event logs
- `templates` - WhatsApp message templates
- `guest_cards` - QR entry cards
- `checkins` - Check-in records
- `error_logs` - Error tracking

All tables are already migrated. No additional migration steps needed.

---

## 3. Meta WhatsApp Cloud API Setup

### Prerequisites

1. **Meta Business Account**: https://business.facebook.com
2. **WhatsApp Business Account**: Create one through Meta Business Manager
3. **Phone Number ID**: Get from WhatsApp Business Account settings
4. **Access Token**: Generate from Meta App Dashboard

### Setup Steps

1. **Create WhatsApp Templates**

   Go to WhatsApp Business Account → Message Templates and create:

   **Template Name**: `dawaa_wedding_invitation`
   - **Language**: Arabic (ar)
   - **Header**: None (no image)
   - **Body**:
     ```
     السلام عليكم ورحمة الله وبركاته

     يسعدنا دعوتك لحضور حفل الزفاف
     العريس: {{1}}
     العروس: {{2}}

     المضيفون: {{3}} و {{4}}
     عدد البطاقات: {{5}}

     تفضل بقبول الدعوة أو الاعتذار عنها
     ```
   - **Footer**: Optional
   - **Buttons**: 
     - "تأكيد الحضور" (Confirm)
     - "الاعتذار" (Decline)

2. **Configure Webhook**

   In Meta App Dashboard → WhatsApp → Configuration:
   - Set Webhook URL: `https://your-domain.com/api/webhooks/meta`
   - Set Verify Token: `dawaa2026`
   - Subscribe to: `messages`, `message_template_status_update`, `message_template_quality_update`

3. **Get Credentials**

   - **Phone Number ID**: WhatsApp Business Account → Phone Numbers
   - **Access Token**: Meta App Dashboard → Tools → Access Tokens
   - **Business Account ID**: Meta Business Manager → Settings

---

## 4. n8n Workflow Setup

### Import the Workflow

1. Open your n8n instance
2. Go to Workflows → Import
3. Upload the `n8n-workflow.json` file from the project root
4. Configure the following nodes:

#### Webhook Node
- Path: `/whatsapp/send-invitations`
- Method: POST
- Response Mode: On Received

#### HTTP Request Node (Send to Meta)
- URL: `https://graph.facebook.com/v25.0/{{ $env.PHONE_NUMBER_ID }}/messages`
- Method: POST
- Headers:
  - `Authorization: Bearer {{ $env.META_BUSINESS_ACCOUNT_ACCESS_TOKEN }}`
  - `Content-Type: application/json`

#### Supabase Nodes
- Connection: Create Supabase connection with your credentials
- Database: Your Supabase database name

### Environment Variables in n8n

Set the following in n8n Credentials:

```
PHONE_NUMBER_ID=1234484883073247
META_BUSINESS_ACCOUNT_ACCESS_TOKEN=your_token
DATABASE_URL=your_supabase_url
```

### Activate the Workflow

1. Click "Activate" to enable the workflow
2. The webhook will be available at: `https://your-n8n-instance.com/webhook/whatsapp/send-invitations`

---

## 5. Connect Website to n8n

The website sends invitations to n8n via the webhook URL. Update in `server/routers.ts`:

```typescript
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 
  "https://your-n8n-instance.com/webhook/whatsapp/send-invitations";

// In sendToGuests mutation:
const response = await fetch(N8N_WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(sendPayload),
});
```

---

## 6. Local Development

### Start the Dev Server

```bash
cd /home/ubuntu/dawaa_events
pnpm install
pnpm run dev
```

The app will be available at `http://localhost:3000`

### Test the Sending Flow

1. Create a booking
2. Add guests with valid Oman phone numbers (format: 968XXXXXXXX)
3. Click "Send Invitations"
4. Monitor n8n workflow logs
5. Check Supabase for message logs

---

## 7. Production Deployment

### Build the Project

```bash
pnpm run build
```

### Deploy to Manus

1. Click "Publish" in the Manus Management UI
2. Configure custom domain (optional)
3. Set environment variables in Manus Settings
4. Deploy

### Post-Deployment Checklist

- [ ] Database is accessible from production
- [ ] All environment variables are set
- [ ] n8n webhook URL is correct
- [ ] Meta API credentials are valid
- [ ] SSL certificate is valid
- [ ] Webhook verification token matches Meta configuration

---

## 8. Testing Checklist

### Unit Tests

```bash
pnpm run test
```

### Manual Testing Checklist

#### Booking Management
- [ ] Create a new booking
- [ ] List all bookings
- [ ] View booking details
- [ ] Edit booking information
- [ ] Delete booking

#### Guest Management
- [ ] Add single guest
- [ ] Add multiple guests
- [ ] Edit guest information
- [ ] Delete single guest
- [ ] Bulk delete guests
- [ ] Search guests by name/phone
- [ ] Filter guests by status
- [ ] Phone number cleaning (Oman format)

#### Invitation Sending
- [ ] Send to single guest
- [ ] Send to selected guests
- [ ] Send to all pending guests
- [ ] Preview template before sending
- [ ] Verify Meta message ID is saved
- [ ] Verify sent timestamp is recorded
- [ ] Check error handling for invalid phone numbers
- [ ] Verify progress indicator during bulk send
- [ ] Check prevent duplicate sending

#### Status Tracking
- [ ] Verify guest status updates to "sent"
- [ ] Check message appears in message logs
- [ ] Verify error logs for failed sends
- [ ] Check webhook logs for all events

#### Dashboard Stats
- [ ] Total guests count
- [ ] Pending count
- [ ] Sent count
- [ ] Failed count
- [ ] Confirmed count
- [ ] Declined count

---

## 9. Troubleshooting

### Common Issues

**Issue**: "Invalid phone number"
- **Solution**: Ensure phone numbers follow Oman format (968XXXXXXXX)

**Issue**: "Meta API error: Invalid access token"
- **Solution**: Regenerate access token in Meta App Dashboard

**Issue**: "Webhook verification failed"
- **Solution**: Verify token matches `VERIFY_TOKEN=dawaa2026`

**Issue**: "Database connection failed"
- **Solution**: Check DATABASE_URL and ensure Supabase is accessible

**Issue**: "n8n workflow not triggering"
- **Solution**: Check webhook URL is correct and n8n workflow is activated

---

## 10. Support & Documentation

- **Meta WhatsApp API**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **n8n Documentation**: https://docs.n8n.io
- **Supabase Documentation**: https://supabase.com/docs
- **Manus Platform**: https://manus.im

---

## Next Steps (Phase 2)

After the sending flow is working, the following features can be added:

1. **RSVP Handling**: Process guest confirmations/declines
2. **Reminders**: Send reminder messages to pending guests
3. **Entry Cards**: Generate and send QR entry cards
4. **Message Center**: Full message history and management
5. **Client Portal**: Client-facing dashboard
6. **Accounting**: Payment tracking and invoicing
7. **AI Agent**: Smart message classification
8. **QR Check-in**: On-site guest check-in scanner

---

**Version**: 1.0.0  
**Last Updated**: June 23, 2026  
**Status**: Production Ready
