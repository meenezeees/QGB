-- =====================================================================
-- QG Barber — 0001: Schema base
-- Extensões, tipos, tabelas, constraints anti-sobreposição e índices.
-- =====================================================================

create extension if not exists btree_gist;
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('client', 'barber', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Utilitário: updated_at automático
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Serviços (IDs preservados do catálogo atual)
-- ---------------------------------------------------------------------
create table if not exists public.services (
  id               text primary key,
  name             text not null,
  category         text not null,
  description      text,
  price_cents      integer not null check (price_cents >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  image_url        text,
  popular          boolean not null default false,
  active           boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Perfis (1:1 com auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  full_name       text not null default '',
  phone           text,
  email           text,
  role            public.user_role not null default 'client',
  lgpd_consent_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Barbeiros (IDs preservados: barber-1, barber-2)
-- E-mail pessoal NÃO é armazenado aqui (fica no perfil do barbeiro).
-- ---------------------------------------------------------------------
create table if not exists public.barbers (
  id              text primary key,
  profile_id      uuid unique references public.profiles (id) on delete set null,
  name            text not null,
  specialty       text,
  bio             text,
  photo_url       text,
  whatsapp_public text,
  active          boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_barbers_updated_at on public.barbers;
create trigger trg_barbers_updated_at
  before update on public.barbers
  for each row execute function public.set_updated_at();

create table if not exists public.barber_services (
  barber_id  text not null references public.barbers (id) on delete cascade,
  service_id text not null references public.services (id) on delete cascade,
  primary key (barber_id, service_id)
);

-- ---------------------------------------------------------------------
-- Horário de funcionamento (0 = domingo ... 6 = sábado)
-- ---------------------------------------------------------------------
create table if not exists public.business_hours (
  weekday       smallint primary key check (weekday between 0 and 6),
  is_open       boolean not null default true,
  opens_at      time,
  closes_at     time,
  break_start   time,
  break_end     time,
  slot_minutes  integer not null default 30 check (slot_minutes > 0),
  check (not is_open or (opens_at is not null and closes_at is not null and closes_at > opens_at)),
  check ((break_start is null) = (break_end is null)),
  check (break_start is null or break_end > break_start)
);

-- ---------------------------------------------------------------------
-- Agendamentos
-- ---------------------------------------------------------------------
create table if not exists public.appointments (
  id                uuid primary key default gen_random_uuid(),
  code              text not null unique,
  client_profile_id uuid references public.profiles (id) on delete set null,
  client_name       text not null check (length(trim(client_name)) between 2 and 120),
  client_phone      text not null check (client_phone ~ '^[0-9]{10,13}$'),
  client_email      text check (client_email is null or client_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  lgpd_consent_at   timestamptz not null,
  barber_id         text not null references public.barbers (id),
  starts_at         timestamptz not null,
  ends_at           timestamptz not null,
  total_price_cents integer not null check (total_price_cents >= 0),
  total_duration    integer not null check (total_duration > 0),
  status            public.appointment_status not null default 'confirmed',
  cancelled_at      timestamptz,
  cancelled_by      uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint appointments_valid_range check (ends_at > starts_at),
  -- Garantia definitiva contra reservas simultâneas/sobrepostas do mesmo barbeiro.
  -- Intervalo semiaberto [início, fim) permite encadear 09:00-09:30 e 09:30-10:00.
  constraint appointments_no_overlap exclude using gist (
    barber_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('pending', 'confirmed'))
);

drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

create index if not exists idx_appointments_barber_start on public.appointments (barber_id, starts_at);
create index if not exists idx_appointments_client_start on public.appointments (client_profile_id, starts_at);
create index if not exists idx_appointments_phone on public.appointments (client_phone);

-- Snapshot dos serviços no momento da reserva (preço/duração congelados)
create table if not exists public.appointment_services (
  appointment_id   uuid not null references public.appointments (id) on delete cascade,
  service_id       text not null references public.services (id),
  service_name     text not null,
  price_cents      integer not null check (price_cents >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  primary key (appointment_id, service_id)
);
