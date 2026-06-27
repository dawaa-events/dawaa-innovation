-- DAWAA EVENTS — Supabase starter schema
-- شغلي هذا الملف داخل Supabase SQL Editor
-- هذا الملف يعطيك قاعدة جاهزة للموقع المستقل، بدون أي ربط إجباري مع النظام القديم.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'client' check (role in ('admin','client','staff')),
  created_at timestamptz default now()
);

create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_phone text not null,
  client_email text,
  event_name text not null,
  event_type text default 'زفاف',
  event_date date,
  venue_name text,
  location_link text,
  reception_time text,
  host_one text,
  host_two text,
  bride_name text,
  groom_name text,
  status text default 'planning',
  health int default 35,
  screen_uploaded boolean default false,
  cards_ready boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.guests (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) on delete cascade,
  guest_name text not null,
  phone_number text not null,
  cards_count int default 1,
  rsvp_status text default 'pending' check (rsvp_status in ('pending','confirmed','declined','sent','delivered','read','failed','checked-in')),
  confirmed_count int default 0,
  declined_count int default 0,
  pending_count int default 1,
  short_code text unique,
  qr_value text unique,
  invitation_sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  replied_at timestamptz,
  checked_in_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  phone_number text,
  direction text default 'outbound' check (direction in ('inbound','outbound','system')),
  message_type text default 'text',
  message_body text,
  meta_message_id text,
  status text default 'sent',
  is_admin_visible boolean default true,
  is_client_visible boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.guest_timeline_events (
  id uuid primary key default uuid_generate_v4(),
  guest_id uuid references public.guests(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  event_type text not null,
  event_data jsonb default '{}',
  source text default 'internal',
  occurred_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  phone text,
  event_type text,
  guests_count int,
  notes text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.guests enable row level security;
alter table public.messages enable row level security;
alter table public.guest_timeline_events enable row level security;
alter table public.leads enable row level security;

-- Admin يرى كل شيء
create policy "admin all profiles" on public.profiles for all using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin all bookings" on public.bookings for all using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin all guests" on public.guests for all using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin all messages" on public.messages for all using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin all timelines" on public.guest_timeline_events for all using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "public insert leads" on public.leads for insert with check (true);
create policy "admin read leads" on public.leads for select using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- Seed sample data بدون auth user
insert into public.bookings (client_name, client_phone, event_name, event_type, event_date, venue_name, reception_time, bride_name, groom_name, health, cards_ready)
values ('سارة محمد','96891234567','زفاف سارة و محمد','زفاف','2026-10-15','قاعة المرجان - مسقط','8:00 مساءً','سارة','محمد',92,true)
on conflict do nothing;

-- إعدادات التسعير والبروموشن كود
create table if not exists public.pricing_settings (
  id text primary key default 'default',
  invitations_first_100 numeric default 20,
  invitations_per_extra_50 numeric default 10,
  security_qr_base numeric default 50,
  instant_photo_price numeric default 80,
  welcome_screen_price numeric default 70,
  promo_enabled boolean default false,
  promo_code text default 'DAWAA10',
  promo_discount numeric default 10,
  updated_at timestamptz default now()
);

alter table public.pricing_settings enable row level security;

create policy "public read pricing" on public.pricing_settings for select using (true);
create policy "admin manage pricing" on public.pricing_settings for all using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

insert into public.pricing_settings (id, invitations_first_100, invitations_per_extra_50, security_qr_base, instant_photo_price, welcome_screen_price, promo_enabled, promo_code, promo_discount)
values ('default', 20, 10, 50, 80, 70, false, 'DAWAA10', 10)
on conflict (id) do nothing;


-- باقات الموقع القابلة للتعديل من بوابة الإدارة
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric default 0,
  description text,
  features jsonb default '[]'::jsonb,
  is_featured boolean default false,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.packages enable row level security;

create policy "public read active packages" on public.packages
  for select using (is_active = true);

create policy "admin manage packages" on public.packages
  for all using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

insert into public.packages (title, price, description, features, is_featured, sort_order, is_active)
values
('البداية', 85, 'بطاقات QR وملفات جاهزة للإرسال', '["بطاقات دخول QR","ملفات مرتبة للإرسال","دعم أساسي"]', false, 1, true),
('دعوة المتكامل', 150, 'إرسال واتساب + متابعة حضور + QR + تقرير', '["إرسال الدعوات عبر واتساب","متابعة الردود","بطاقات QR","تقرير نهائي"]', true, 2, true),
('المميز', 220, 'كل شيء + شاشة ترحيبية + تنظيم إضافي', '["كل مميزات المتكامل","شاشة ترحيبية","تنظيم إضافي","أولوية في الدعم"]', false, 3, true)
on conflict do nothing;

-- Customer/admin accounts for Dawaa portal
create table if not exists public.portal_accounts (
  id uuid primary key default gen_random_uuid(),
  account_type text not null check (account_type in ('admin','client')),
  display_name text not null,
  email text unique not null,
  username text unique,
  password_hash text,
  booking_id uuid,
  is_active boolean default true,
  permissions jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.portal_accounts enable row level security;

create policy if not exists "Admins can manage portal accounts"
  on public.portal_accounts
  for all
  using (true)
  with check (true);

-- Suggested client account fields for bookings table if using a separate auth system
alter table if exists public.bookings
  add column if not exists client_account_email text,
  add column if not exists client_portal_enabled boolean default true;


-- Portal accounts for client/admin login
create table if not exists portal_accounts (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'client',
  name text,
  email text unique,
  username text unique,
  password text,
  active boolean default true,
  booking_id text,
  permissions jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Visitor ratings collected from the demo modal
create table if not exists visitor_ratings (
  id uuid primary key default gen_random_uuid(),
  name text,
  event_name text,
  rating int check (rating between 1 and 5),
  message text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Entry card matching fields / optional production support
alter table if exists guests add column if not exists entry_card_file text;
alter table if exists guests add column if not exists entry_card_file_id text;
alter table if exists guests add column if not exists entry_card_matched_at timestamptz;

create table if not exists entry_card_files (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null,
  guest_id text,
  file_name text not null,
  file_url text,
  matched_at timestamptz,
  created_at timestamptz default now()
);

-- WhatsApp Meta direct integration additions
alter table public.guests add column if not exists meta_message_id text;
create index if not exists guests_meta_message_id_idx on public.guests(meta_message_id);
create index if not exists guests_phone_number_idx on public.guests(phone_number);

create table if not exists public.webhook_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table public.webhook_events enable row level security;
create policy "admin read webhook events" on public.webhook_events
  for select using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
