import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve and sanitize environment variables
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabaseUrl = typeof rawSupabaseUrl === 'string' ? rawSupabaseUrl.trim() : '';
const supabaseKey = typeof rawSupabaseKey === 'string' ? rawSupabaseKey.trim() : '';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('seu-projeto')
);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ [QGB Supabase] Variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_PUBLISHABLE_KEY não configuradas em .env.local. ' +
    'O site utilizará o catálogo local de segurança e fallback de agendamento.'
  );
}

// Fallback dummy URL to prevent createClient from throwing if unconfigured during development
const effectiveUrl = isSupabaseConfigured ? supabaseUrl : 'https://dummy-qg-barber.supabase.co';
const effectiveKey = isSupabaseConfigured ? supabaseKey : 'dummy-anon-key';

export const supabase: SupabaseClient = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;
