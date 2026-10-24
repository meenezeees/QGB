-- ====================================================================
-- QG BARBER — MIGRAÇÃO 02: POLÍTICAS DE RLS (MENOR PRIVILÉGIO)
-- ====================================================================

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2. Função auxiliar para verificar se o usuário autenticado é Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Função auxiliar para verificar se o usuário autenticado é Barbeiro
CREATE OR REPLACE FUNCTION public.is_barber()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('barber', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- POLÍTICAS: public.services
-- ====================================================================
DROP POLICY IF EXISTS "Qualquer pessoa pode visualizar servicos ativos" ON public.services;
CREATE POLICY "Qualquer pessoa pode visualizar servicos ativos"
ON public.services FOR SELECT
USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Apenas administradores podem inserir servicos" ON public.services;
CREATE POLICY "Apenas administradores podem inserir servicos"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Apenas administradores podem atualizar servicos" ON public.services;
CREATE POLICY "Apenas administradores podem atualizar servicos"
ON public.services FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Apenas administradores podem deletar servicos" ON public.services;
CREATE POLICY "Apenas administradores podem deletar servicos"
ON public.services FOR DELETE
TO authenticated
USING (public.is_admin());

-- ====================================================================
-- POLÍTICAS: public.professionals
-- ====================================================================
DROP POLICY IF EXISTS "Qualquer pessoa pode visualizar profissionais ativos" ON public.professionals;
CREATE POLICY "Qualquer pessoa pode visualizar profissionais ativos"
ON public.professionals FOR SELECT
USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Apenas administradores podem inserir profissionais" ON public.professionals;
CREATE POLICY "Apenas administradores podem inserir profissionais"
ON public.professionals FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Apenas administradores podem atualizar profissionais" ON public.professionals;
CREATE POLICY "Apenas administradores podem atualizar profissionais"
ON public.professionals FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Apenas administradores podem deletar profissionais" ON public.professionals;
CREATE POLICY "Apenas administradores podem deletar profissionais"
ON public.professionals FOR DELETE
TO authenticated
USING (public.is_admin());

-- ====================================================================
-- POLÍTICAS: public.profiles
-- ====================================================================
DROP POLICY IF EXISTS "Usuarios podem ler seu proprio perfil" ON public.profiles;
CREATE POLICY "Usuarios podem ler seu proprio perfil"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios podem atualizar seu proprio perfil" ON public.profiles;
CREATE POLICY "Usuarios podem atualizar seu proprio perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid() OR public.is_admin())
WITH CHECK (
  (id = auth.uid() AND (role IS NULL OR role = (SELECT role FROM public.profiles WHERE id = auth.uid()))) 
  OR public.is_admin()
);

-- ====================================================================
-- POLÍTICAS: public.appointments
-- ====================================================================

-- A. SELECT: Disponibilidade pública e visualização privada
-- Qualquer pessoa (anon ou auth) pode consultar os agendamentos para checar horários ocupados.
-- O frontend consome apenas data/horário para bloquear slots indisponíveis na interface.
DROP POLICY IF EXISTS "Permitir leitura de agendamentos para calculo de slots" ON public.appointments;
CREATE POLICY "Permitir leitura de agendamentos para calculo de slots"
ON public.appointments FOR SELECT
USING (
  -- Agendamentos futuros ou de hoje para montagem de agenda
  appointment_date >= CURRENT_DATE - INTERVAL '1 day'
  -- Ou se for o próprio cliente autenticado
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  -- Ou se for staff/admin
  OR public.is_barber()
);

-- B. INSERT: Qualquer cliente pode agendar seu horário online
-- Permite tanto clientes anônimos (inserindo nome e telefone) quanto autenticados
DROP POLICY IF EXISTS "Permitir criacao de agendamentos online" ON public.appointments;
CREATE POLICY "Permitir criacao de agendamentos online"
ON public.appointments FOR INSERT
WITH CHECK (
  customer_name IS NOT NULL 
  AND length(trim(customer_name)) >= 2
  AND customer_phone IS NOT NULL 
  AND length(regexp_replace(customer_phone, '\D', '', 'g')) >= 10
  AND appointment_date >= CURRENT_DATE
  AND status IN ('confirmed', 'pending')
);

-- C. UPDATE: Cancelamento pelo cliente ou gestão por Barbeiro/Admin
DROP POLICY IF EXISTS "Permitir cancelamento ou gestao de agendamentos" ON public.appointments;
CREATE POLICY "Permitir cancelamento ou gestao de agendamentos"
ON public.appointments FOR UPDATE
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR public.is_barber()
)
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid() AND status = 'cancelled')
  OR public.is_barber()
);

-- ====================================================================
-- TRIGGER AUTOMÁTICO: Criação de Perfil no Cadastro (Supabase Auth)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
