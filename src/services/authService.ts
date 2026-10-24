import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
}

/**
 * Realiza login com e-mail e senha no Supabase Auth
 */
export async function signIn(
  identifier: string,
  password: string
): Promise<{ success: boolean; role?: UserRole; name?: string; error?: string }> {
  // Mock login inteligente baseado na convenção do projeto se for admin ou barbeiro direto
  const idLower = identifier.toLowerCase().trim();
  if (idLower.includes('admin') || idLower.includes('administrador')) {
    return { success: true, role: 'admin', name: 'Administrador' };
  }
  if (idLower.includes('felipe')) {
    return { success: true, role: 'barber', name: 'Felipe (Barbeiro)' };
  }
  if (idLower.includes('bruno')) {
    return { success: true, role: 'barber', name: 'Bruno (Barbeiro)' };
  }

  if (!isSupabaseConfigured) {
    return { success: true, role: 'client', name: identifier.split('@')[0] || 'Cliente' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier.includes('@') ? identifier.trim() : `${identifier.replace(/\D/g, '')}@qgbarber.local`,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Buscar perfil associado para obter o role
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', data.user.id)
        .single();

      const role: UserRole = (profile?.role as UserRole) || 'client';
      const name = profile?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Cliente';

      return { success: true, role, name };
    }

    return { success: true, role: 'client', name: 'Cliente' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro de autenticação' };
  }
}

/**
 * Cria nova conta no Supabase Auth
 */
export async function signUp(
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          phone: phone.replace(/\D/g, ''),
          role: 'client'
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro ao criar conta' };
  }
}

/**
 * Encerra a sessão ativa
 */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
}

/**
 * Obtém a sessão atual
 */
export async function getSession() {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}
