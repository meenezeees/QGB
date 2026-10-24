-- ====================================================================
-- QG BARBER — MIGRAÇÃO 01: ESTRUTURA DO BANCO DE DADOS
-- ====================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. Tabela de Perfis de Usuários (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'barber', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Profissionais / Barbeiros
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  specialty TEXT,
  bio TEXT,
  photo_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabela de Serviços
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  category TEXT,
  image_url TEXT,
  popular BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Garantir colunas caso a tabela já tenha sido criada previamente
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 30;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS popular BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

-- Colunas complementares para professionals
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

-- 5. Tabela de Agendamentos (Appointments)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE RESTRICT,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'pending')),
  total_price_cents INTEGER,
  service_name TEXT,
  professional_name TEXT,
  notes TEXT,
  source TEXT DEFAULT 'website', -- website, whatsapp, n8n, walkin
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Garantir colunas na tabela appointments
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS professional_id UUID REFERENCES public.professionals(id) ON DELETE RESTRICT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT 'Cliente';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS customer_phone TEXT NOT NULL DEFAULT '';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS appointment_date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS start_time TIME NOT NULL DEFAULT '08:30:00';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS end_time TIME NOT NULL DEFAULT '09:00:00';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'confirmed';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS total_price_cents INTEGER;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS service_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS professional_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website';

-- 6. RESTRIÇÃO ATÔMICA ANTI-CONFLITO (Prevenção de Colisão de Horários)
-- Impede que o mesmo profissional tenha agendamentos simultâneos sobrepostos no mesmo dia e intervalo de tempo.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_appointments'
  ) THEN
    ALTER TABLE public.appointments
    ADD CONSTRAINT no_overlapping_appointments
    EXCLUDE USING gist (
      professional_id WITH =,
      tsrange((appointment_date + start_time)::timestamp, (appointment_date + end_time)::timestamp) WITH &&
    )
    WHERE (status != 'cancelled');
  END IF;
END $$;

-- 7. Índices de Alta Performance
CREATE INDEX IF NOT EXISTS idx_appointments_date_prof ON public.appointments(appointment_date, professional_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_phone ON public.appointments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);
CREATE INDEX IF NOT EXISTS idx_professionals_active ON public.professionals(active);

-- 8. View de Compatibilidade (barbers -> professionals)
CREATE OR REPLACE VIEW public.barbers AS
SELECT 
  id,
  name,
  phone,
  email,
  specialty,
  bio,
  photo_url,
  active,
  created_at
FROM public.professionals;

-- 9. Trigger de Atualização Automática de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_appointments_updated_at ON public.appointments;
CREATE TRIGGER trigger_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
