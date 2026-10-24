import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ServiceItem, BarberItem } from '../types';
import { SERVICES as FALLBACK_SERVICES, BARBERS as FALLBACK_BARBERS } from '../data/barbershop.data';

/**
 * Normaliza os serviços do Supabase para a interface ServiceItem utilizada nos componentes
 */
export async function getServices(): Promise<ServiceItem[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_SERVICES;
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('price_cents', { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback para os dados estáticos auditados se a tabela ainda não tiver dados
      return FALLBACK_SERVICES;
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      price: (item.price_cents || 0) / 100,
      duration: item.duration_minutes || 30,
      category: (item.category as any) || 'Cortes Tradicionais',
      description: item.description || '',
      image_url: item.image_url || undefined,
      popular: Boolean(item.popular),
      active: Boolean(item.active)
    }));
  } catch (err) {
    console.warn('Falha ao carregar serviços do Supabase, utilizando fallback local:', err);
    return FALLBACK_SERVICES;
  }
}

/**
 * Normaliza os profissionais do Supabase para a interface BarberItem utilizada nos componentes
 */
export async function getProfessionals(): Promise<BarberItem[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_BARBERS;
  }

  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_BARBERS;
    }

    return data.map((item, idx) => ({
      id: item.id,
      name: item.name,
      phone: item.phone || (FALLBACK_BARBERS[idx]?.phone || '11978334717'),
      email: item.email || (FALLBACK_BARBERS[idx]?.email || ''),
      specialty: item.specialty || (FALLBACK_BARBERS[idx]?.specialty || 'Especialista em visagismo'),
      bio: item.bio || (FALLBACK_BARBERS[idx]?.bio || 'Profissional qualificado da equipe QG Barber.'),
      photo_url: item.photo_url || FALLBACK_BARBERS[idx]?.photo_url,
      active: Boolean(item.active),
      service_ids: FALLBACK_BARBERS[idx]?.service_ids || []
    }));
  } catch (err) {
    console.warn('Falha ao carregar profissionais do Supabase, utilizando fallback local:', err);
    return FALLBACK_BARBERS;
  }
}
