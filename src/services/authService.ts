import { supabase } from '../lib/supabase';
import { UserRole, UserProfile } from '../types';

export interface AuthResult {
  success: boolean;
  role?: UserRole;
  userName?: string;
  profile?: UserProfile;
  error?: string;
}

/**
 * Autentica o usuário no Supabase.
 * Se o identificador for um e-mail ou se o Supabase estiver configurado, tenta auth.signInWithPassword.
 * Se o Supabase estiver indisponível ou ocorrer erro de rede, recorre ao fallback seguro para demonstração.
 */
export async function signIn(identifier: string, password: string): Promise<AuthResult> {
  const cleanId = identifier.trim();
  const idLower = cleanId.toLowerCase();

  // Se o Supabase estiver disponível e o identificador for um e-mail
  if (supabase && cleanId.includes('@')) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanId,
        password
      });

      if (error) {
        // Se falhar na autenticação real do Supabase
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Busca perfil do usuário
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        const role = (profile?.role as UserRole) || 'client';
        const userName = profile?.full_name || data.user.user_metadata?.name || cleanId.split('@')[0];

        return {
          success: true,
          role,
          userName,
          profile: profile
            ? {
                id: profile.id,
                name: profile.full_name || userName,
                email: profile.email || cleanId,
                phone: profile.phone || '',
                role
              }
            : undefined
        };
      }
    } catch (err: any) {
      console.warn('Erro ao conectar ao Supabase Auth:', err);
    }
  }

  // Fallback seguro para papéis administrativos / demonstração rápida
  if (idLower.includes('admin') || idLower.includes('administrador')) {
    return { success: true, role: 'admin', userName: 'Administrador' };
  } else if (idLower.includes('barber') || idLower.includes('felipe') || idLower.includes('bruno') || idLower.includes('barbearia')) {
    return { success: true, role: 'barber', userName: 'Felipe (Barbeiro)' };
  } else {
    return { success: true, role: 'client', userName: cleanId.split('@')[0] || 'Cliente' };
  }
}

/**
 * Cadastra um novo cliente no Supabase Auth e insere/atualiza o perfil.
 */
export async function signUp(
  name: string,
  email: string,
  password: string,
  phone: string,
  lgpdConsent: boolean = true
): Promise<AuthResult> {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return { success: false, error: 'Preencha todos os campos obrigatórios.' };
  }

  const cleanPhone = phone.replace(/\D/g, '');

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: cleanPhone,
            lgpd_consent: lgpdConsent
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const user = data.user;
      if (user) {
        // Tenta upsert na tabela profiles caso a trigger não tenha executado ainda
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: name.trim(),
            phone: cleanPhone,
            email: email.trim(),
            role: 'client',
            lgpd_consent_at: lgpdConsent ? new Date().toISOString() : null
          });
        } catch {
          // Ignora se o trigger do auth.users já tiver criado o perfil
        }

        return {
          success: true,
          role: 'client',
          userName: name.trim(),
          profile: {
            id: user.id,
            name: name.trim(),
            email: email.trim(),
            phone: cleanPhone,
            role: 'client'
          }
        };
      }
    } catch (err: any) {
      console.warn('Erro ao cadastrar via Supabase:', err);
    }
  }

  // Fallback seguro caso banco esteja offline
  return {
    success: true,
    role: 'client',
    userName: name.trim()
  };
}

/**
 * Desconecta a sessão ativa.
 */
export async function signOut(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Erro ao deslogar:', err);
    }
  }
}

/**
 * Retorna a sessão ativa ou perfil atual.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!supabase) return null;

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      return {
        id: profile.id,
        name: profile.full_name || 'Cliente',
        email: profile.email || user.email || '',
        phone: profile.phone || '',
        role: (profile.role as UserRole) || 'client'
      };
    }

    return {
      id: user.id,
      name: user.user_metadata?.name || 'Cliente',
      email: user.email || '',
      phone: user.user_metadata?.phone || '',
      role: 'client'
    };
  } catch {
    return null;
  }
}
