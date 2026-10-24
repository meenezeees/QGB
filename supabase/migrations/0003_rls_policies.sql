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
