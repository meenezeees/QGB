-- =====================================================================
-- QG BARBER — SETUP COMPLETO SUPABASE POSTGRESQL
-- Execute este arquivo no Supabase SQL Editor em caso de execução manual.
-- Idempotente: pode ser executado mais de uma vez com segurança.
-- =====================================================================

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


-- =====================================================================
-- QG Barber — 0002: Seed (gerado de src/data/barbershop.data.ts)
-- 15 serviços, 2 barbeiros e horários de funcionamento atuais.
-- Idempotente: pode ser executado novamente com segurança.
-- =====================================================================

insert into public.services (id, name, category, description, price_cents, duration_minutes, image_url, popular, active, sort_order) values
  ('srv-1788658109981-0tfn', 'Cabelo + Barba (combo)', 'Combos Promocionais', 'A experiência completa: corte de cabelo detalhado com alinhamento e modelagem de barba na navalha.', 6000, 60, './QG Barber - Images/Servicos/image (1).jpeg', true, true, 1),
  ('srv-1788889406018-vypb', 'Cabelo + Sobrancelha (combo)', 'Combos Promocionais', 'Corte moderno ou clássico acompanhado de desenho e limpeza precisa das sobrancelhas.', 4500, 30, './QG Barber - Images/Servicos/image (2).jpeg', true, true, 2),
  ('srv-1', 'Cabelo', 'Cortes Tradicionais', 'Corte tesoura ou máquina (degradê, fade, social, undercut) com acabamento impecável de pezinho.', 3500, 30, './QG Barber - Images/Servicos/image (3).jpeg', true, true, 3),
  ('srv-2', 'Barba', 'Barboterapia', 'Barboterapia com toalha quente, navalha descartável, óleos emolientes e loção pós-barba refrescante.', 3500, 30, './QG Barber - Images/Servicos/image (8).jpeg', true, true, 4),
  ('srv-1788658278790-5r00', 'Nevou', 'Química & Coloração', 'Descoloração global com proteção do couro cabeludo e matização platinada perfeita.', 12500, 70, './QG Barber - Images/Servicos/image (5).jpeg', true, true, 5),
  ('srv-1788658199741-b1rz', 'Alisamento', 'Química & Coloração', 'Redução de volume e alinhamento dos fios com aspecto natural, brilho e maleabilidade.', 9500, 60, './QG Barber - Images/Servicos/image (12).jpeg', false, true, 6),
  ('srv-1787276818975-ahd4', 'Luzes', 'Química & Coloração', 'Mechas na touca ou papel com tonalização personalizada para um visual iluminado e marcante.', 9000, 60, './QG Barber - Images/Servicos/image (6).jpeg', false, true, 7),
  ('srv-1788658227985-gga2', 'Botox', 'Tratamentos', 'Reposição de massa capilar, eliminação de frizz e selagem profunda das cutículas.', 7500, 50, './QG Barber - Images/Servicos/image (14).jpeg', false, true, 8),
  ('srv-1788658167242-1fs0', 'Hidratação', 'Tratamentos', 'Tratamento intensivo com máscara nutritiva para devolver maciez, força e vida aos cabelos.', 2500, 20, './QG Barber - Images/Servicos/image (13).jpeg', false, true, 9),
  ('srv-1788658381377-kk7n', 'Pigmentação', 'Acabamentos & Estilo', 'Preenchimento e disfarce óptico de falhas na barba ou cabelo com tinta especial hipoalergênica.', 2500, 20, './QG Barber - Images/Servicos/image (15).jpeg', false, true, 10),
  ('srv-1788658352074-k7iq', 'Penteado', 'Acabamentos & Estilo', 'Lavagem, secagem e finalização com pomadas ou fixadores de alta performance (efeito matte ou brilho).', 2000, 20, './QG Barber - Images/Servicos/image (11).jpeg', false, true, 11),
  ('srv-1787276844471-23y1', 'Cavanhaque', 'Barboterapia', 'Desenho e alinhamento preciso do cavanhaque com toalha morna e navalha esterilizada.', 1500, 10, './QG Barber - Images/Servicos/image (9).jpeg', false, true, 12),
  ('srv-1787018103374-sspw', 'Freestyle', 'Acabamentos & Estilo', 'Linhas, riscos, traços geométricos e arte navalhada personalizada nas laterais.', 1000, 10, './QG Barber - Images/Servicos/image (4).jpeg', false, true, 13),
  ('srv-1786933264068-cmho', 'Sobrancelha', 'Acabamentos & Estilo', 'Limpeza, alinhamento e desenho do arco da sobrancelha na navalha com precisão cirúrgica.', 1000, 10, './QG Barber - Images/Servicos/image (7).jpeg', false, true, 14),
  ('srv-3', 'Bigode', 'Barboterapia', 'Aparo, alinhamento e limpeza do bigode mantendo o contorno perfeito.', 500, 5, './QG Barber - Images/Servicos/image (10).jpeg', false, true, 15)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  price_cents = excluded.price_cents,
  duration_minutes = excluded.duration_minutes,
  image_url = excluded.image_url,
  popular = excluded.popular,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into public.barbers (id, name, specialty, bio, photo_url, whatsapp_public, active, sort_order) values
  ('barber-1', 'Felipe', 'Degradê na régua, químicas, nevou & barba clássica', 'Mais de 8 anos de experiência em cortes masculinos, especialista em transformações, visagismo e atendimento de alto padrão.', './QG Barber - Images/Equipe/image (16).jpeg', '11978334717', true, 1),
  ('barber-2', 'Bruno', 'Cortes modernos, freestyle, barba terapia & acabamentos finos', 'Técnica apurada em tesoura e máquina, foco em precisão, pontualidade rigorosa e atendimento consultivo.', './QG Barber - Images/Equipe/image (17).jpeg', '11995328416', true, 2)
on conflict (id) do update set
  name = excluded.name,
  specialty = excluded.specialty,
  bio = excluded.bio,
  photo_url = excluded.photo_url,
  whatsapp_public = excluded.whatsapp_public,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into public.barber_services (barber_id, service_id) values
  ('barber-1', 'srv-1788658109981-0tfn'),
  ('barber-1', 'srv-1788889406018-vypb'),
  ('barber-1', 'srv-1'),
  ('barber-1', 'srv-1787276844471-23y1'),
  ('barber-1', 'srv-1788658278790-5r00'),
  ('barber-1', 'srv-1787276818975-ahd4'),
  ('barber-1', 'srv-1786933264068-cmho'),
  ('barber-1', 'srv-2'),
  ('barber-1', 'srv-1787018103374-sspw'),
  ('barber-1', 'srv-3'),
  ('barber-1', 'srv-1788658167242-1fs0'),
  ('barber-1', 'srv-1788658199741-b1rz'),
  ('barber-1', 'srv-1788658227985-gga2'),
  ('barber-1', 'srv-1788658352074-k7iq'),
  ('barber-1', 'srv-1788658381377-kk7n'),
  ('barber-2', 'srv-1788658109981-0tfn'),
  ('barber-2', 'srv-1788889406018-vypb'),
  ('barber-2', 'srv-1'),
  ('barber-2', 'srv-1787276844471-23y1'),
  ('barber-2', 'srv-1788658278790-5r00'),
  ('barber-2', 'srv-1787276818975-ahd4'),
  ('barber-2', 'srv-1786933264068-cmho'),
  ('barber-2', 'srv-2'),
  ('barber-2', 'srv-1787018103374-sspw'),
  ('barber-2', 'srv-3'),
  ('barber-2', 'srv-1788658167242-1fs0'),
  ('barber-2', 'srv-1788658199741-b1rz'),
  ('barber-2', 'srv-1788658227985-gga2'),
  ('barber-2', 'srv-1788658352074-k7iq'),
  ('barber-2', 'srv-1788658381377-kk7n')
on conflict do nothing;

-- Horários (OPERATING_HOURS + grade atual do agendamento, que pula 12:00 e 12:30)
-- 0 = domingo ... 6 = sábado
insert into public.business_hours (weekday, is_open, opens_at, closes_at, break_start, break_end, slot_minutes) values
  (0, false, null,    null,    null,    null,    30),
  (1, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (2, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (3, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (4, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (5, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (6, true,  '08:30', '16:00', '12:00', '13:00', 30)
on conflict (weekday) do update set
  is_open = excluded.is_open,
  opens_at = excluded.opens_at,
  closes_at = excluded.closes_at,
  break_start = excluded.break_start,
  break_end = excluded.break_end,
  slot_minutes = excluded.slot_minutes;


-- =====================================================================
-- QG Barber — 0003: Políticas de Segurança RLS (Row Level Security)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Funções de Apoio de Segurança (SECURITY DEFINER com search_path fixo)
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.current_barber_id()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select id
  from public.barbers
  where profile_id = auth.uid()
    and active = true
  limit 1;
$$;

-- ---------------------------------------------------------------------
-- Trigger: Cria perfil automaticamente no cadastro (auth.users)
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, email, role, lgpd_consent_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    new.email,
    'client',
    case when (new.raw_user_meta_data->>'lgpd_consent')::boolean is true then now() else null end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: Impede que o próprio usuário altere seu role
create or replace function public.prevent_self_role_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Você não tem permissão para alterar seu próprio nível de acesso.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_role_change on public.profiles;
create trigger trg_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_self_role_change();

-- ---------------------------------------------------------------------
-- Habilitar RLS em todas as tabelas
-- ---------------------------------------------------------------------
alter table public.services enable row level security;
alter table public.profiles enable row level security;
alter table public.barbers enable row level security;
alter table public.barber_services enable row level security;
alter table public.business_hours enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_services enable row level security;

-- ---------------------------------------------------------------------
-- Policies: Services
-- ---------------------------------------------------------------------
drop policy if exists "Services are viewable by everyone" on public.services;
create policy "Services are viewable by everyone"
  on public.services for select
  using (active = true or public.is_admin());

drop policy if exists "Services are editable only by admin" on public.services;
create policy "Services are editable only by admin"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Policies: Barbers
-- ---------------------------------------------------------------------
drop policy if exists "Barbers are viewable by everyone" on public.barbers;
create policy "Barbers are viewable by everyone"
  on public.barbers for select
  using (active = true or public.is_admin());

drop policy if exists "Barbers are editable only by admin" on public.barbers;
create policy "Barbers are editable only by admin"
  on public.barbers for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Policies: Barber Services
-- ---------------------------------------------------------------------
drop policy if exists "Barber services are viewable by everyone" on public.barber_services;
create policy "Barber services are viewable by everyone"
  on public.barber_services for select
  using (true);

drop policy if exists "Barber services are editable only by admin" on public.barber_services;
create policy "Barber services are editable only by admin"
  on public.barber_services for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Policies: Business Hours
-- ---------------------------------------------------------------------
drop policy if exists "Business hours viewable by everyone" on public.business_hours;
create policy "Business hours viewable by everyone"
  on public.business_hours for select
  using (true);

drop policy if exists "Business hours editable only by admin" on public.business_hours;
create policy "Business hours editable only by admin"
  on public.business_hours for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Policies: Profiles
-- ---------------------------------------------------------------------
drop policy if exists "Profiles are viewable by owner or admin" on public.profiles;
create policy "Profiles are viewable by owner or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles are updatable by owner or admin" on public.profiles;
create policy "Profiles are updatable by owner or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- ---------------------------------------------------------------------
-- Policies: Appointments
-- ---------------------------------------------------------------------
drop policy if exists "Appointments viewable by owner, assigned barber, or admin" on public.appointments;
create policy "Appointments viewable by owner, assigned barber, or admin"
  on public.appointments for select
  using (
    client_profile_id = auth.uid()
    or barber_id = public.current_barber_id()
    or public.is_admin()
  );

drop policy if exists "Appointments cancellable by owner" on public.appointments;
create policy "Appointments cancellable by owner"
  on public.appointments for update
  using (
    client_profile_id = auth.uid()
    or barber_id = public.current_barber_id()
    or public.is_admin()
  )
  with check (
    client_profile_id = auth.uid()
    or barber_id = public.current_barber_id()
    or public.is_admin()
  );

-- ---------------------------------------------------------------------
-- Policies: Appointment Services
-- ---------------------------------------------------------------------
drop policy if exists "Appointment services viewable by authorized users" on public.appointment_services;
create policy "Appointment services viewable by authorized users"
  on public.appointment_services for select
  using (
    exists (
      select 1 from public.appointments a
      where a.id = appointment_id
        and (
          a.client_profile_id = auth.uid()
          or a.barber_id = public.current_barber_id()
          or public.is_admin()
        )
    )
  );


-- =====================================================================
-- QG Barber — 0004: Funções RPC e Regras de Negócio do Banco
-- =====================================================================

-- ---------------------------------------------------------------------
-- RPC 1: create_appointment
-- Criação atômica de agendamento com cálculo e validação no servidor.
-- Previne concorrência e sobreposição via restrição EXCLUDE do Postgres.
-- ---------------------------------------------------------------------
create or replace function public.create_appointment(
  p_client_name       text,
  p_client_phone      text,
  p_client_email      text default null,
  p_barber_id         text default 'barber-1',
  p_service_ids       text[] default array[]::text[],
  p_date              date default current_date,
  p_start_time        text default '09:00',
  p_client_profile_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clean_phone       text;
  v_starts_at         timestamptz;
  v_ends_at           timestamptz;
  v_total_duration    integer := 0;
  v_total_price_cents integer := 0;
  v_service_count     integer;
  v_barber_active     boolean;
  v_dow               smallint;
  v_hours             record;
  v_start_time_val    time;
  v_end_time_val      time;
  v_appointment_id    uuid;
  v_code              text;
  v_profile_id        uuid;
  v_service_rec       record;
  v_result            jsonb;
begin
  -- 1. Sanitizar e validar dados do cliente
  v_clean_phone := regexp_replace(coalesce(p_client_phone, ''), '\D', '', 'g');
  if length(v_clean_phone) < 10 or length(v_clean_phone) > 13 then
    raise exception 'Telefone inválido. Informe o DDD e o número completo (ex: 11999999999).';
  end if;

  if trim(coalesce(p_client_name, '')) = '' then
    raise exception 'Nome do cliente é obrigatório.';
  end if;

  if array_length(p_service_ids, 1) is null or array_length(p_service_ids, 1) = 0 then
    raise exception 'Selecione ao menos um serviço para agendar.';
  end if;

  -- 2. Validar barbeiro
  select active into v_barber_active
  from public.barbers
  where id = p_barber_id;

  if v_barber_active is not true then
    raise exception 'Barbeiro selecionado não está ativo ou não foi encontrado.';
  end if;

  -- 3. Calcular totais a partir do banco (não confia nos valores do cliente)
  select
    coalesce(sum(price_cents), 0),
    coalesce(sum(duration_minutes), 0),
    count(*)
  into v_total_price_cents, v_total_duration, v_service_count
  from public.services
  where id = any(p_service_ids)
    and active = true;

  if v_service_count <> array_length(p_service_ids, 1) then
    raise exception 'Um ou mais serviços selecionados são inválidos ou estão inativos.';
  end if;

  -- 4. Construir timestamps no fuso America/Sao_Paulo
  begin
    v_start_time_val := p_start_time::time;
  exception when others then
    raise exception 'Formato de horário inicial inválido (use HH:MI).';
  end if;

  v_starts_at := (p_date::text || ' ' || p_start_time || ':00')::timestamp at time zone 'America/Sao_Paulo';
  v_ends_at := v_starts_at + (v_total_duration || ' minutes')::interval;
  v_end_time_val := (v_ends_at at time zone 'America/Sao_Paulo')::time;

  -- Impedir agendamento no passado
  if v_starts_at < (now() - interval '5 minutes') then
    raise exception 'Não é permitido agendar em horários ou datas passadas.';
  end if;

  -- 5. Validar horário de funcionamento
  v_dow := extract(dow from (v_starts_at at time zone 'America/Sao_Paulo'))::smallint;

  select * into v_hours
  from public.business_hours
  where weekday = v_dow;

  if not found or v_hours.is_open is not true then
    raise exception 'A barbearia está fechada nesta data selecionada (domingo/feriado).';
  end if;

  if v_start_time_val < v_hours.opens_at or v_start_time_val >= v_hours.closes_at then
    raise exception 'Horário fora do expediente da barbearia (% às %).', to_char(v_hours.opens_at, 'HH24:MI'), to_char(v_hours.closes_at, 'HH24:MI');
  end if;

  -- Verificar intervalo de almoço se configurado
  if v_hours.break_start is not null and v_hours.break_end is not null then
    if (v_start_time_val >= v_hours.break_start and v_start_time_val < v_hours.break_end) then
      raise exception 'Horário dentro do intervalo de almoço da barbearia (% às %).', to_char(v_hours.break_start, 'HH24:MI'), to_char(v_hours.break_end, 'HH24:MI');
    end if;
  end if;

  -- 6. Gerar código único e determinar profile_id
  v_code := 'QG-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
  v_profile_id := coalesce(auth.uid(), p_client_profile_id);

  -- 7. Inserir agendamento (a restrição EXCLUDE garante atomicidade mesmo sob alta concorrência)
  begin
    insert into public.appointments (
      code,
      client_profile_id,
      client_name,
      client_phone,
      client_email,
      lgpd_consent_at,
      barber_id,
      starts_at,
      ends_at,
      total_price_cents,
      total_duration,
      status
    ) values (
      v_code,
      v_profile_id,
      trim(p_client_name),
      v_clean_phone,
      nullif(trim(p_client_email), ''),
      now(),
      p_barber_id,
      v_starts_at,
      v_ends_at,
      v_total_price_cents,
      v_total_duration,
      'confirmed'
    )
    returning id into v_appointment_id;

  exception
    when exclusion_violation then
      raise exception 'Horário indisponível: o barbeiro selecionado já possui um agendamento neste intervalo. Por favor, escolha outro horário.';
  end;

  -- 8. Inserir snapshot dos serviços vinculados
  for v_service_rec in
    select id, name, price_cents, duration_minutes
    from public.services
    where id = any(p_service_ids)
  loop
    insert into public.appointment_services (
      appointment_id,
      service_id,
      service_name,
      price_cents,
      duration_minutes
    ) values (
      v_appointment_id,
      v_service_rec.id,
      v_service_rec.name,
      v_service_rec.price_cents,
      v_service_rec.duration_minutes
    );
  end loop;

  -- 9. Retornar dados estruturados para o frontend
  select jsonb_build_object(
    'id', a.id,
    'code', a.code,
    'client_name', a.client_name,
    'client_phone', a.client_phone,
    'client_email', a.client_email,
    'barber_id', a.barber_id,
    'barber_name', b.name,
    'date', to_char(a.starts_at at time zone 'America/Sao_Paulo', 'YYYY-MM-DD'),
    'start_time', to_char(a.starts_at at time zone 'America/Sao_Paulo', 'HH24:MI'),
    'end_time', to_char(a.ends_at at time zone 'America/Sao_Paulo', 'HH24:MI'),
    'total_price_cents', a.total_price_cents,
    'total_duration', a.total_duration,
    'status', a.status,
    'services', (
      select jsonb_agg(jsonb_build_object(
        'id', s.service_id,
        'name', s.service_name,
        'price_cents', s.price_cents,
        'duration_minutes', s.duration_minutes
      ))
      from public.appointment_services s
      where s.appointment_id = a.id
    )
  ) into v_result
  from public.appointments a
  join public.barbers b on b.id = a.barber_id
  where a.id = v_appointment_id;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------
-- RPC 2: get_busy_slots
-- Consulta horários ocupados para uma data e barbeiro específicos.
-- Protege a privacidade: retorna apenas os intervalos ocupados, sem expor dados de clientes.
-- ---------------------------------------------------------------------
create or replace function public.get_busy_slots(
  p_date      date,
  p_barber_id text default null
)
returns table (
  barber_id  text,
  start_time text,
  end_time   text,
  starts_at  timestamptz,
  ends_at    timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    a.barber_id,
    to_char(a.starts_at at time zone 'America/Sao_Paulo', 'HH24:MI') as start_time,
    to_char(a.ends_at at time zone 'America/Sao_Paulo', 'HH24:MI') as end_time,
    a.starts_at,
    a.ends_at
  from public.appointments a
  where date(a.starts_at at time zone 'America/Sao_Paulo') = p_date
    and (p_barber_id is null or a.barber_id = p_barber_id)
    and a.status in ('pending', 'confirmed')
  order by a.starts_at asc;
$$;

-- ---------------------------------------------------------------------
-- RPC 3: cancel_appointment
-- Cancela um agendamento liberando imediatamente o slot de horário.
-- ---------------------------------------------------------------------
create or replace function public.cancel_appointment(
  p_appointment_id uuid,
  p_client_phone   text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_apt record;
  v_clean_phone text;
  v_authorized boolean := false;
begin
  select * into v_apt
  from public.appointments
  where id = p_appointment_id;

  if not found then
    raise exception 'Agendamento não encontrado.';
  end if;

  if v_apt.status = 'cancelled' then
    return true; -- Já cancelado
  end if;

  v_clean_phone := regexp_replace(coalesce(p_client_phone, ''), '\D', '', 'g');

  -- Checar permissão
  if public.is_admin() then
    v_authorized := true;
  elsif auth.uid() is not null and v_apt.client_profile_id = auth.uid() then
    v_authorized := true;
  elsif public.current_barber_id() is not null and v_apt.barber_id = public.current_barber_id() then
    v_authorized := true;
  elsif v_clean_phone <> '' and v_apt.client_phone = v_clean_phone then
    v_authorized := true;
  end if;

  if not v_authorized then
    raise exception 'Não autorizado a cancelar este agendamento.';
  end if;

  update public.appointments
  set status = 'cancelled',
      cancelled_at = now(),
      cancelled_by = auth.uid()
  where id = p_appointment_id;

  return true;
end;
$$;

-- ---------------------------------------------------------------------
-- RPC 4: get_admin_metrics
-- Estatísticas resumidas para o painel administrativo mestre
-- ---------------------------------------------------------------------
create or replace function public.get_admin_metrics()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today_apts integer;
  v_total_clients integer;
  v_active_barbers integer;
  v_total_revenue_cents bigint;
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito ao administrador.';
  end if;

  select count(*) into v_today_apts
  from public.appointments
  where date(starts_at at time zone 'America/Sao_Paulo') = current_date
    and status in ('pending', 'confirmed');

  select count(distinct client_phone) into v_total_clients
  from public.appointments;

  select count(*) into v_active_barbers
  from public.barbers
  where active = true;

  select coalesce(sum(total_price_cents), 0) into v_total_revenue_cents
  from public.appointments
  where status in ('confirmed', 'completed');

  return jsonb_build_object(
    'today_appointments', v_today_apts,
    'total_clients', v_total_clients,
    'active_barbers', v_active_barbers,
    'total_revenue_cents', v_total_revenue_cents
  );
end;
$$;

-- Conceder permissão de execução nas funções públicas para anon e authenticated
grant execute on function public.create_appointment to anon, authenticated;
grant execute on function public.get_busy_slots to anon, authenticated;
grant execute on function public.cancel_appointment to anon, authenticated;
grant execute on function public.get_admin_metrics to authenticated;
