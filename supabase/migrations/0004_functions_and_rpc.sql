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
