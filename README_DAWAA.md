# دعوة - Dawaa Events

**A complete WhatsApp-based event management platform for wedding and party invitations**

## 🎉 Features

### Phase 1: Core Sending Flow (Current)

✅ **Booking Management**
- Create and manage event bookings
- Store event details (date, venue, hosts, bride/groom names)
- Client information management

✅ **Guest List Management**
- Add guests manually or via CSV/Excel
- Automatic phone number cleaning (Oman 968 format)
- Edit and delete individual guests
- Bulk delete with confirmation
- Search and filter by name/phone/status
- Track guest status (pending, sent, delivered, read, confirmed, declined, failed)

✅ **WhatsApp Invitation Sending**
- Send via Meta Cloud API v25.0
- Template: `dawaa_wedding_invitation` (no image header)
- Template variables:
  - `guest_name` - Guest name
  - `host_one` - First host name
  - `host_two` - Second host name
  - `bride_name` - Bride name
  - `groom_name` - Groom name
  - `cards_count` - Number of entry cards

✅ **Sending Options**
- Send to single guest
- Send to selected guests (multi-select)
- Send to all pending guests
- Retry failed sends
- Progress indicator during bulk sending
- Prevent duplicate sending

✅ **Message Tracking**
- Save Meta message ID
- Track sent timestamp
- Record delivery status
- Log error messages
- Full response logging for debugging

✅ **Dashboard Statistics**
- Total guests
- Pending count
- Sent count
- Delivered count
- Read count
- Confirmed count
- Declined count
- Failed count

✅ **n8n Integration**
- Complete workflow for Meta API integration
- Error handling and retry logic
- Supabase logging
- Webhook verification

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL/Supabase database
- Meta WhatsApp Business Account
- n8n instance
- Manus account (for hosting)

### Installation

```bash
# Clone the project
cd /home/ubuntu/dawaa_events

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run migrations (already done)
pnpm drizzle-kit generate

# Start dev server
pnpm run dev
```

Visit `http://localhost:3000`

---

## 📋 Project Structure

```
dawaa_events/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx                    # Landing page
│       │   ├── BookingsPage.tsx            # Booking list & creation
│       │   ├── GuestsPage.tsx              # Guest management
│       │   └── SendInvitationsPage.tsx     # Invitation sending
│       ├── components/
│       │   ├── DashboardLayout.tsx         # Main layout
│       │   └── ui/                         # shadcn/ui components
│       └── App.tsx                         # Main app with routing
├── server/
│   ├── routers.ts                          # tRPC procedures
│   ├── db.ts                               # Database helpers
│   └── _core/                              # Framework core
├── drizzle/
│   ├── schema.ts                           # Database schema
│   └── migrations/                         # SQL migrations
├── n8n-workflow.json                       # n8n workflow
├── SETUP_INSTRUCTIONS.md                   # Detailed setup guide
└── README_DAWAA.md                         # This file
```

---

## 🔧 Configuration

### Environment Variables

See `SETUP_INSTRUCTIONS.md` for complete list.

Key variables:
- `DATABASE_URL` - Supabase connection string
- `PHONE_NUMBER_ID` - Meta WhatsApp phone number ID
- `META_BUSINESS_ACCOUNT_ACCESS_TOKEN` - Meta API token
- `VERIFY_TOKEN` - Webhook verification token (default: dawaa2026)
- `N8N_WEBHOOK_URL` - n8n workflow webhook URL

### Database Schema

14 tables for complete event management:
- `users` - User accounts
- `bookings` - Event bookings
- `guests` - Guest lists
- `messages` - Message history
- `message_status_logs` - Delivery tracking
- `templates` - WhatsApp templates
- `guest_cards` - QR entry cards
- `checkins` - Check-in records
- `webhook_logs` - Webhook events
- `error_logs` - Error tracking

---

## 🌐 API Endpoints

All endpoints use tRPC. Key procedures:

### Bookings
- `bookings.create` - Create new booking
- `bookings.list` - List all bookings
- `bookings.getById` - Get booking details
- `bookings.update` - Update booking
- `bookings.stats` - Get booking statistics

### Guests
- `guests.create` - Add guest
- `guests.listByBooking` - List guests
- `guests.getById` - Get guest details
- `guests.update` - Update guest
- `guests.delete` - Delete guest
- `guests.bulkDelete` - Delete multiple guests
- `guests.getPending` - Get pending guests

### Invitations
- `invitations.sendToGuests` - Send to specific guests
- `invitations.sendToPending` - Send to all pending

### Message Status
- `messageStatus.logStatus` - Log delivery status

---

## 📱 UI Components

### Pages

**Home** (`/`)
- Landing page with features overview
- Login button for unauthenticated users

**Bookings** (`/bookings`)
- List of all bookings
- Create new booking form
- Click to manage guests

**Guests** (`/bookings/:bookingId/guests`)
- Guest list with status
- Add/edit/delete guests
- Bulk operations
- Search and filter
- Statistics cards

**Send Invitations** (`/bookings/:bookingId/send`)
- Template selection
- Preview before sending
- Send options (one/selected/all pending)
- Progress indicator
- Guest list with send status
- Message ID and timestamp tracking

---

## 🔌 n8n Workflow

The `n8n-workflow.json` file contains:

1. **Webhook Node** - Receives send requests from website
2. **Loop Node** - Iterates through guests
3. **HTTP Request** - Sends to Meta Cloud API v25.0
4. **Supabase Nodes** - Logs messages, status, and errors
5. **Response Nodes** - Returns success/error to website

### Workflow Flow

```
Webhook Receive
    ↓
Set Variables
    ↓
Loop Through Guests
    ↓
Send to Meta Cloud API
    ├─ Success → Log Message → Log Status → Update Guest
    └─ Error → Log Error → Mark as Failed
    ↓
Log Completion
    ↓
Return Response
```

---

## 🧪 Testing

### Run Tests

```bash
pnpm run test
```

### Manual Testing Checklist

See `SETUP_INSTRUCTIONS.md` section 8 for complete checklist.

Key tests:
- [ ] Create booking
- [ ] Add guests with Oman phone numbers
- [ ] Send invitations
- [ ] Check Meta message ID saved
- [ ] Verify delivery status tracking
- [ ] Test error handling

---

## 🎨 Design

- **Language**: Arabic (RTL)
- **Color Scheme**: Purple, Pink, Blue gradients
- **Components**: shadcn/ui
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

---

## 📊 Database Schema Highlights

### Guests Table

```sql
CREATE TABLE guests (
  id VARCHAR(36) PRIMARY KEY,
  bookingId VARCHAR(36),
  guestName TEXT,
  phoneNumber VARCHAR(20),
  cardsCount INT DEFAULT 1,
  rsvpStatus ENUM(...),
  invitationSentAt TIMESTAMP,
  deliveredAt TIMESTAMP,
  readAt TIMESTAMP,
  repliedAt TIMESTAMP,
  checkedInAt TIMESTAMP,
  metaMessageId VARCHAR(100),
  ...
);
```

### Messages Table

```sql
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  guestId VARCHAR(36),
  bookingId VARCHAR(36),
  phoneNumber VARCHAR(20),
  metaMessageId VARCHAR(100) UNIQUE,
  messageType VARCHAR(50),
  messageContent JSON,
  timestamp TIMESTAMP,
  ...
);
```

---

## 🔐 Security

- Role-based access control (admin, user)
- OAuth authentication via Manus
- Secure environment variables
- SQL injection prevention via ORM
- HTTPS only in production
- Webhook verification token

---

## 📈 Performance

- Optimized database queries
- Pagination for large guest lists
- Lazy loading for images
- Efficient state management
- Minimal bundle size

---

## 🐛 Troubleshooting

### Common Issues

**Phone number validation fails**
- Ensure format is Oman: 968XXXXXXXX

**Meta API returns error**
- Check access token is valid
- Verify phone number ID
- Ensure template is approved

**n8n workflow not triggering**
- Verify webhook URL is correct
- Check n8n workflow is activated
- Review n8n logs

See `SETUP_INSTRUCTIONS.md` section 9 for more.

---

## 🗺️ Roadmap

### Phase 2: RSVP & Reminders
- Handle guest confirmations/declines
- Send reminder messages
- Track response rates

### Phase 3: Entry Cards & Check-in
- Generate QR codes
- Send entry cards
- On-site check-in scanner
- Welcome screens (Arabic)

### Phase 4: Advanced Features
- Message Center
- Client Portal
- Accounting & Invoicing
- AI Message Classification
- Payment Integration

---

## 📞 Support

For issues or questions:
1. Check `SETUP_INSTRUCTIONS.md`
2. Review n8n workflow logs
3. Check Supabase database logs
4. Review browser console for errors

---

## 📄 License

All rights reserved © 2026

---

## 🙏 Acknowledgments

Built with:
- React 19
- Tailwind CSS 4
- tRPC 11
- Drizzle ORM
- n8n
- Meta WhatsApp Cloud API
- Supabase

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: June 23, 2026

---

## Quick Links

- [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- [n8n Workflow](./n8n-workflow.json)
- [Database Schema](./drizzle/schema.ts)
- [API Routers](./server/routers.ts)
