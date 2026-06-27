# Dawaa Events - Deployment & Setup Guide

## Overview

Dawaa Events is a complete WhatsApp-based wedding invitation and guest management platform built with React, tRPC, Supabase, and n8n.

## Prerequisites

- Meta WhatsApp Business Account
- Meta App with WhatsApp API access
- Supabase account
- n8n instance (cloud or self-hosted)
- Manus platform account

## Step 1: Meta WhatsApp Setup

### 1.1 Get Your Credentials

1. Go to [Meta App Dashboard](https://developers.facebook.com/apps)
2. Create or select your app
3. Add WhatsApp product
4. Go to **WhatsApp → API Setup**
5. Note your:
   - **Phone Number ID**: `1234484883073247` (used in API calls)
   - **Business Account ID**: (for verification)
   - **Access Token**: Generate from Settings → User Token

### 1.2 Create WhatsApp Template

1. Go to **WhatsApp → Message Templates**
2. Create new template: `dawaa_wedding_invitation`
3. Language: **Arabic**
4. Category: **MARKETING**
5. Template body (example):

```
السلام عليكم ورحمة الله وبركاته

يسعدنا دعوتكم لحضور حفل الزفاف
{{1}} و {{2}}

المضيفان: {{3}} و {{4}}
اسم العروس: {{5}}
اسم العريس: {{6}}
عدد البطاقات: {{7}}

نتطلع لحضوركم
```

**Variables:**
- `{{1}}` = guest_name
- `{{2}}` = (bride_name + groom_name combined for display)
- `{{3}}` = host_one
- `{{4}}` = host_two
- `{{5}}` = bride_name
- `{{6}}` = groom_name
- `{{7}}` = cards_count

**Important:** This template has NO header image.

### 1.3 Verify Phone Number

1. Go to **WhatsApp → Phone Numbers**
2. Add your business phone number
3. Complete verification (SMS or call)
4. Wait for approval (usually instant)

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Note your:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: (public key)
   - **Service Role Key**: (secret key)

### 2.2 Database Tables

The schema is already created in the project. Tables include:
- `users` - User accounts
- `bookings` - Event bookings
- `guests` - Guest lists
- `message_status_logs` - WhatsApp message tracking
- `webhook_logs` - Error and event logs

Run migrations:
```bash
pnpm drizzle-kit migrate
```

## Step 3: n8n Workflow Setup

### 3.1 Import Workflow

1. Open your n8n instance
2. Create new workflow
3. Import `n8n-workflow-complete.json`
4. Configure credentials:

**Meta API Credential:**
- Type: HTTP Header Auth
- Header: `Authorization: Bearer YOUR_META_ACCESS_TOKEN`

**Supabase Credential:**
- Type: HTTP Header Auth
- Headers:
  - `apikey: YOUR_SUPABASE_ANON_KEY`
  - `Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY`

### 3.2 Set Environment Variables

In n8n workflow, set these variables:
- `META_ACCESS_TOKEN` = Your Meta access token
- `SUPABASE_URL` = Your Supabase project URL
- `SUPABASE_KEY` = Your Supabase service role key
- `WEBSITE_URL` = Your Manus website URL

### 3.3 Activate Webhook

1. In the "Webhook - Receive Send Request" node
2. Copy the webhook URL
3. Save it for later (needed in website config)

## Step 4: Website Configuration

### 4.1 Environment Variables

Set these in Manus Settings → Secrets:

```
META_PHONE_NUMBER_ID=1234484883073247
META_ACCESS_TOKEN=your_meta_token_here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/send-invitations
```

### 4.2 Database Connection

The website automatically connects to Supabase using `DATABASE_URL` (set by Manus).

Verify connection:
1. Go to Bookings page
2. Create a test booking
3. Check Supabase dashboard → bookings table

## Step 5: Testing

### 5.1 Test Booking Creation

1. Log in to website
2. Go to **الحجوزات** (Bookings)
3. Click **حجز جديد** (New Booking)
4. Fill all fields:
   - Client name
   - Phone number
   - Event date
   - Hosts names
   - Bride & groom names
5. Click **إنشاء** (Create)

### 5.2 Test Guest Addition

1. Click **الضيوف** (Guests) on the booking
2. Click **إضافة ضيف** (Add Guest)
3. Fill:
   - Guest name
   - Phone number (Oman format: 968XXXXXXXX or 9XXXXXXXX)
   - Cards count
4. Click **إضافة** (Add)

### 5.3 Test Invitation Sending

1. Click **إرسال الدعوات** (Send Invitations)
2. Select guests
3. Click **معاينة** (Preview) to see template
4. Click **إرسال الدعوات** (Send Invitations)
5. Confirm

### 5.4 Verify Sending

1. Check n8n workflow logs
2. Check Supabase `message_status_logs` table
3. Check website dashboard for status updates
4. Verify guest received WhatsApp message

## Step 6: Production Deployment

### 6.1 Publish Website

1. In Manus Management UI
2. Click **Publish** button
3. Choose deployment region
4. Wait for deployment to complete

### 6.2 Update Meta Webhook

1. Go to Meta App Dashboard
2. WhatsApp → Configuration
3. Set webhook URL to your published website
4. Verify token: `VERIFY_TOKEN=dawaa2026`

### 6.3 Enable Webhook Events

In Meta App Dashboard:
- Subscribe to: `messages`, `message_template_status_update`, `message_template_quality_update`

## Troubleshooting

### Issue: "Invalid phone number"

**Solution:** Ensure phone numbers follow Oman 968 format:
- Valid: `96891234567` or `91234567`
- Invalid: `+96891234567` (will be auto-cleaned)

### Issue: n8n webhook not receiving requests

**Solution:**
1. Check n8n webhook URL is correct
2. Verify n8n instance is running
3. Check n8n logs for errors
4. Test webhook with curl:
```bash
curl -X POST https://your-n8n-instance/webhook/send-invitations \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "test",
    "guestId": "test",
    "phoneNumber": "96891234567",
    "templateName": "dawaa_wedding_invitation",
    "variables": {
      "guest_name": "Test Guest",
      "host_one": "Host 1",
      "host_two": "Host 2",
      "bride_name": "Bride",
      "groom_name": "Groom",
      "cards_count": "1"
    }
  }'
```

### Issue: Meta API returns 400 error

**Solution:**
1. Verify template name matches exactly: `dawaa_wedding_invitation`
2. Verify template is approved in Meta
3. Verify phone number format (with country code)
4. Check all template variables are provided
5. Verify access token is valid

### Issue: Supabase connection fails

**Solution:**
1. Verify `DATABASE_URL` is set correctly
2. Check Supabase project is active
3. Verify network allows Supabase connections
4. Check Supabase credentials in n8n

## Performance Tips

1. **Bulk Sending:** Send to max 100 guests per batch
2. **Rate Limiting:** Meta allows ~1000 messages/hour per phone number
3. **Retry Logic:** n8n automatically retries failed sends
4. **Monitoring:** Check Supabase logs regularly

## Security

1. **Never commit secrets** - Use environment variables
2. **Rotate tokens** - Regenerate Meta access tokens monthly
3. **Backup database** - Enable Supabase backups
4. **Monitor logs** - Check webhook_logs table for errors

## Support

For issues:
1. Check `.manus-logs/` directory for errors
2. Review n8n workflow logs
3. Check Supabase dashboard
4. Contact Manus support at https://help.manus.im

## Next Features (Phase 2)

- RSVP handling via WhatsApp buttons
- Automated reminders
- Entry cards with QR codes
- QR check-in scanner
- Message center
- Client portal
- Accounting reports
- AI-powered message classification
