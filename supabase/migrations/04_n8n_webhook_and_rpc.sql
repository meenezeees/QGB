-- ====================================================================
-- QG BARBER — MIGRAÇÃO 04: RPC ATÔMICA E INTEGRAÇÃO N8N (WEBHOOKS)
-- ====================================================================
-- Production n8n Webhook URL: https://athrmnzs.app.n8n.cloud/webhook/agendamento
-- Supabase Project: https://ctmedwnrjeistkgiualv.supabase.co
-- ====================================================================

-- 1. Habilitar extensão pg_net para chamadas HTTP assíncronas do PostgreSQL
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA extensions;

-- 2. FUNÇÃO ATÔMICA DE AGENDAMENTO (PREVENÇÃO DE CONFLITO EM NÍVEL DE BANCO)
-- Esta função pode ser chamada diretamente pelo cliente frontend (via supabase.rpc)
-- ou pelo n8n, garantindo transação serializada atômica.
CREATE OR REPLACE FUNCTION public.book_appointment_atomic(
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_appointment_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_professional_id UUID,
  p_service_id UUID DEFAULT NULL,
  p_customer_email TEXT DEFAULT NULL,
  p_total_price_cents INTEGER DEFAULT NULL,
  p_service_name TEXT DEFAULT NULL,
  p_professional_name TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'website'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conflict_count INTEGER;
  v_new_id UUID;
  v_user_id UUID;
  v_resolved_prof_name TEXT;
  v_resolved_srv_name TEXT;
  v_resolved_price INTEGER;
BEGIN
  -- Identifica o usuário logado se houver sessão ativa
  v_user_id := auth.uid();

  -- Validações básicas de entrada
  IF p_customer_name IS NULL OR length(trim(p_customer_name)) < 2 THEN
    RETURN jsonb_build_object('success', false, 'code', 'INVALID_NAME', 'message', 'Nome completo obrigatório.');
  END IF;

  IF p_customer_phone IS NULL OR length(regexp_replace(p_customer_phone, '\D', '', 'g')) < 10 THEN
    RETURN jsonb_build_object('success', false, 'code', 'INVALID_PHONE', 'message', 'Telefone com DDD obrigatório.');
  END IF;

  IF p_appointment_date < CURRENT_DATE THEN
    RETURN jsonb_build_object('success', false, 'code', 'INVALID_DATE', 'message', 'A data deve ser igual ou posterior a hoje.');
  END IF;

  -- 1. Verifica colisão de horário com exclusão mútua (bloqueio atômico)
  SELECT count(*)
  INTO v_conflict_count
  FROM public.appointments
  WHERE professional_id = p_professional_id
    AND appointment_date = p_appointment_date
    AND status != 'cancelled'
    AND tsrange((appointment_date + start_time)::timestamp, (appointment_date + end_time)::timestamp) &&
        tsrange((p_appointment_date + p_start_time)::timestamp, (p_appointment_date + p_end_time)::timestamp);

  IF v_conflict_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'SLOT_OCCUPIED',
      'message', 'Este horário acabou de ser reservado por outro cliente. Por favor, escolha outro horário.'
    );
  END IF;

  -- 2. Resolver nomes e preços se não fornecidos
  IF p_professional_name IS NULL AND p_professional_id IS NOT NULL THEN
    SELECT name INTO v_resolved_prof_name FROM public.professionals WHERE id = p_professional_id;
  ELSE
    v_resolved_prof_name := p_professional_name;
  END IF;

  IF p_service_name IS NULL AND p_service_id IS NOT NULL THEN
    SELECT name, price_cents INTO v_resolved_srv_name, v_resolved_price FROM public.services WHERE id = p_service_id;
  ELSE
    v_resolved_srv_name := p_service_name;
    v_resolved_price := p_total_price_cents;
  END IF;

  -- 3. Inserção Atômica
  INSERT INTO public.appointments (
    user_id,
    professional_id,
    service_id,
    customer_name,
    customer_phone,
    customer_email,
    appointment_date,
    start_time,
    end_time,
    status,
    total_price_cents,
    service_name,
    professional_name,
    notes,
    source
  ) VALUES (
    v_user_id,
    p_professional_id,
    p_service_id,
    trim(p_customer_name),
    regexp_replace(p_customer_phone, '\D', '', 'g'),
    trim(p_customer_email),
    p_appointment_date,
    p_start_time,
    p_end_time,
    'confirmed',
    COALESCE(p_total_price_cents, v_resolved_price),
    v_resolved_srv_name,
    v_resolved_prof_name,
    p_notes,
    p_source
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'code', 'BOOKED',
    'id', v_new_id,
    'message', 'Agendamento confirmado com sucesso!'
  );
EXCEPTION
  WHEN exclusion_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'SLOT_OCCUPIED',
      'message', 'Conflito de agendamento: horário já reservado.'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'INTERNAL_ERROR',
      'message', SQLERRM
    );
END;
$$;

-- Permite que anon e authenticated executem o RPC book_appointment_atomic
GRANT EXECUTE ON FUNCTION public.book_appointment_atomic TO anon, authenticated;

-- ====================================================================
-- 3. DISPARADOR AUTOMÁTICO DE WEBHOOK PARA O N8N (VIA PG_NET)
-- ====================================================================
-- Sempre que um agendamento for criado ou atualizado no Supabase,
-- esta função envia automaticamente um POST HTTP assíncrono para o n8n.
CREATE OR REPLACE FUNCTION public.notify_n8n_on_appointment()
RETURNS TRIGGER AS $$
DECLARE
  v_payload JSONB;
BEGIN
  -- Monta o payload estruturado com todas as informações necessárias
  v_payload := jsonb_build_object(
    'event', CASE 
      WHEN TG_OP = 'INSERT' THEN 'appointment_created'
      WHEN TG_OP = 'UPDATE' AND NEW.status = 'cancelled' THEN 'appointment_cancelled'
      ELSE 'appointment_updated'
    END,
    'operation', TG_OP,
    'appointment_id', NEW.id,
    'client_id', NEW.user_id,
    'customer_name', NEW.customer_name,
    'customer_phone', NEW.customer_phone,
    'customer_email', NEW.customer_email,
    'professional_id', NEW.professional_id,
    'professional_name', NEW.professional_name,
    'service_id', NEW.service_id,
    'service_name', NEW.service_name,
    'service_price', (COALESCE(NEW.total_price_cents, 0)::numeric / 100),
    'appointment_date', NEW.appointment_date,
    'start_time', NEW.start_time,
    'end_time', NEW.end_time,
    'status', NEW.status,
    'notes', NEW.notes,
    'source', NEW.source,
    'created_at', NEW.created_at,
    'timestamp', timezone('utc'::text, now())
  );

  -- Disparo assíncrono não-bloqueante para a URL de produção do n8n
  PERFORM net.http_post(
    url := 'https://athrmnzs.app.n8n.cloud/webhook/agendamento',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Accept', 'application/json',
      'User-Agent', 'Supabase-QGB-Webhook/2.0'
    ),
    body := v_payload::text
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Garante que se o n8n estiver indisponível, o agendamento no Supabase NÃO falha
    RAISE WARNING 'Aviso: Falha ao notificar n8n webhook: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criação do Trigger na tabela appointments
DROP TRIGGER IF EXISTS trigger_notify_n8n ON public.appointments;
CREATE TRIGGER trigger_notify_n8n
AFTER INSERT OR UPDATE ON public.appointments
FOR EACH ROW EXECUTE PROCEDURE public.notify_n8n_on_appointment();

-- ====================================================================
-- 4. CONFIGURAÇÃO ALTERNATIVA: DATABASE WEBHOOKS NO PAINEL DO SUPABASE
-- ====================================================================
-- Caso prefira utilizar a interface visual nativa do Supabase (Database Webhooks):
--
-- 1. No painel do Supabase (https://supabase.com/dashboard/project/ctmedwnrjeistkgiualv):
--    Acesse: Database > Webhooks > Create a new webhook
--
-- 2. Preencha com os dados exatos:
--    - Name: n8n_agendamento
--    - Table: public.appointments
--    - Events: [x] Insert, [x] Update
--    - Method: POST
--    - URL: https://athrmnzs.app.n8n.cloud/webhook/agendamento
--    - HTTP Headers:
--        Content-Type: application/json
--
-- 3. No seu workflow do n8n (https://athrmnzs.app.n8n.cloud):
--    - Abra o nó Webhook "agendamento".
--    - Garanta que o método HTTP esteja configurado como POST.
--    - Clique no botão "Active" (alternar para ATIVO) no canto superior direito do editor do n8n.
--    - Pronto! O workflow será acionado instantaneamente a cada novo agendamento.
