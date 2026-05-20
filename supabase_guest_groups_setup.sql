create table if not exists public.guest_groups (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text,
  invitation_slug text not null unique,
  group_type text not null default 'single' check (group_type in ('single', 'couple', 'family')),
  max_guests integer not null default 1 check (max_guests > 0),
  plus_one_allowed boolean not null default false,
  table_number integer,
  invitation_status text not null default 'draft' check (invitation_status in ('draft', 'sending', 'sent', 'failed')),
  invitation_sent_at timestamptz,
  invitation_channel text check (invitation_channel in ('manual', 'whatsapp', 'email')),
  invitation_error text,
  created_at timestamptz not null default now()
);

alter table public.guest_groups
  add column if not exists invitation_slug text,
  add column if not exists group_type text not null default 'single',
  add column if not exists max_guests integer not null default 1,
  add column if not exists plus_one_allowed boolean not null default false,
  add column if not exists table_number integer,
  add column if not exists invitation_status text not null default 'draft',
  add column if not exists invitation_sent_at timestamptz,
  add column if not exists invitation_channel text,
  add column if not exists invitation_error text,
  add column if not exists created_at timestamptz not null default now();

alter table public.guests
  add column if not exists guest_group_id uuid references public.guest_groups(id) on delete cascade;

create unique index if not exists guest_groups_invitation_slug_key
  on public.guest_groups (invitation_slug);

create index if not exists guest_groups_wedding_id_idx
  on public.guest_groups (wedding_id);

create index if not exists guests_guest_group_id_idx
  on public.guests (guest_group_id);
