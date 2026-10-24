import { supabase } from '../lib/supabase';
import { SERVICES, BARBERS, OPERATING_HOURS } from '../data/barbershop.data';
import { ServiceItem, BarberItem } from '../types';

/**
 * Carrega a lista de serviços ativos do Supabase.
 * Se o Supabase estiver indisponível ou a tabela estiver vazia, utiliza o catálogo local seguro.
 */
export async function getServices(): Promise<ServiceItem[]> {
  if (!supabase) return SERVICES;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return SERVICES;
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category as any,
      description: item.description || '',
      price: item.price_cents / 100,
      duration: item.duration_minutes,
      image_url: item.image_url || undefined,
      popular: item.popular,
      active: item.active
    }));
  } catch (err) {
    console.warn('Fallback para catálogo estático de serviços:', err);
    return SERVICES;
  }
}

/**
 * Carrega os profissionais e seus vínculos de serviços.
 */
export async function getBarbers(): Promise<BarberItem[]> {
  if (!supabase) return BARBERS;

  try {
    const [barbersRes, linksRes] = await Promise.all([
      supabase.from('barbers').select('*').eq('active', true).order('sort_order', { ascending: true }),
      supabase.from('barber_services').select('*')
    ]);

    if (barbersRes.error || !barbersRes.data || barbersRes.data.length === 0) {
      return BARBERS;
    }

    const links = linksRes.data || [];

    return barbersRes.data.map((b) => {
      const serviceIds = links.filter((l) => l.barber_id === b.id).map((l) => l.service_id);
      return {
        id: b.id,
        name: b.name,
        specialty: b.specialty || '',
        bio: b.bio || '',
        photo_url: b.photo_url || undefined,
        phone: b.whatsapp_public || '',
        email: '',
        active: b.active,
        service_ids: serviceIds.length > 0 ? serviceIds : SERVICES.map((s) => s.id)
      };
    });
  } catch (err) {
    console.warn('Fallback para barbeiros estáticos:', err);
    return BARBERS;
  }
}
