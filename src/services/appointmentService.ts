import { supabase } from '../lib/supabase';
import { Appointment } from '../types';

export interface CreateAppointmentInput {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  barberId: string;
  barberName: string;
  serviceId?: string;
  serviceIds: string[];
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string;
  startTime: string;
  endTime: string;
}

/**
 * Consulta os horários ocupados para a data e barbeiro selecionados.
 * Retorna uma lista de strings de horários ("09:00", "09:30", etc.)
 */
export async function getOccupiedSlots(date: string, barberId?: string): Promise<string[]> {
  if (!supabase || !date) return [];

  try {
    const { data, error } = await supabase.rpc('get_busy_slots', {
      p_date: date,
      p_barber_id: barberId || null
    });

    if (error || !data) {
      console.warn('Erro ao consultar horários ocupados:', error?.message);
      return [];
    }

    // data é array de { barber_id, start_time, end_time, starts_at, ends_at }
    const busyTimes: string[] = [];
    data.forEach((slot: any) => {
      if (slot.start_time) {
        busyTimes.push(slot.start_time.slice(0, 5));
      }
    });

    return busyTimes;
  } catch (err) {
    console.warn('Falha na chamada get_busy_slots:', err);
    return [];
  }
}

/**
 * Criação segura de agendamento através da RPC atômica do PostgreSQL.
 * O preço e duração são recalculados no servidor para evitar manipulação de valores.
 */
export async function createAppointment(
  input: CreateAppointmentInput
): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
  if (!supabase) {
    // Modo local / demonstração
    const localApt: Appointment = {
      id: `apt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      client_id: `usr-${Date.now().toString(36)}`,
      client_name: input.clientName,
      client_phone: input.clientPhone,
      client_email: input.clientEmail,
      barber_id: input.barberId,
      barber_name: input.barberName,
      service_ids: input.serviceIds,
      service_name: input.serviceName,
      service_price: input.servicePrice,
      service_duration: input.serviceDuration,
      date: input.date,
      start_time: input.startTime,
      end_time: input.endTime,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
    return { success: true, appointment: localApt };
  }

  try {
    const sessionRes = await supabase.auth.getSession();
    const profileId = sessionRes.data.session?.user?.id || null;

    const { data, error } = await supabase.rpc('create_appointment', {
      p_client_name: input.clientName,
      p_client_phone: input.clientPhone,
      p_client_email: input.clientEmail || null,
      p_barber_id: input.barberId,
      p_service_ids: input.serviceIds,
      p_date: input.date,
      p_start_time: input.startTime,
      p_client_profile_id: profileId
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Não foi possível confirmar o agendamento.'
      };
    }

    const payload: any = data;
    const appointment: Appointment = {
      id: payload.code || payload.id,
      client_id: payload.client_phone,
      client_name: payload.client_name,
      client_phone: payload.client_phone,
      client_email: payload.client_email,
      barber_id: payload.barber_id,
      barber_name: payload.barber_name,
      service_ids: input.serviceIds,
      service_name: payload.services?.map((s: any) => s.name).join(' + ') || input.serviceName,
      service_price: (payload.total_price_cents || 0) / 100,
      service_duration: payload.total_duration || input.serviceDuration,
      date: payload.date || input.date,
      start_time: payload.start_time || input.startTime,
      end_time: payload.end_time || input.endTime,
      status: payload.status || 'confirmed',
      created_at: new Date().toISOString()
    };

    return { success: true, appointment };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Erro inesperado ao criar agendamento no Supabase.'
    };
  }
}

/**
 * Cancela um agendamento e libera imediatamente o horário para outros clientes.
 */
export async function cancelAppointment(
  appointmentId: string,
  clientPhone?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.rpc('cancel_appointment', {
      p_appointment_id: appointmentId,
      p_client_phone: clientPhone || null
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Busca agendamentos do cliente logado.
 */
export async function fetchMyAppointments(): Promise<Appointment[]> {
  if (!supabase) return [];

  try {
    const sessionRes = await supabase.auth.getSession();
    const uid = sessionRes.data.session?.user?.id;
    if (!uid) return [];

    const { data, error } = await supabase
      .from('appointments')
      .select('*, barbers(name), appointment_services(service_name)')
      .eq('client_profile_id', uid)
      .order('starts_at', { ascending: false });

    if (error || !data) return [];

    return data.map(mapDatabaseAppointment);
  } catch (err) {
    console.warn('Erro ao buscar agendamentos do usuário:', err);
    return [];
  }
}

/**
 * Busca agendamentos para o barbeiro selecionado.
 */
export async function fetchBarberAppointments(barberId: string, date?: string): Promise<Appointment[]> {
  if (!supabase) return [];

  try {
    let query = supabase
      .from('appointments')
      .select('*, barbers(name), appointment_services(service_name)')
      .eq('barber_id', barberId)
      .order('starts_at', { ascending: true });

    if (date) {
      // Começo e fim do dia no fuso de SP
      query = query
        .gte('starts_at', `${date}T00:00:00-03:00`)
        .lte('starts_at', `${date}T23:59:59-03:00`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapDatabaseAppointment);
  } catch (err) {
    console.warn('Erro ao buscar agendamentos do barbeiro:', err);
    return [];
  }
}

/**
 * Converte um registro do banco no tipo Appointment da aplicação.
 */
function mapDatabaseAppointment(raw: any): Appointment {
  const startsAt = new Date(raw.starts_at);
  const endsAt = new Date(raw.ends_at);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
  const formatDate = (d: Date) =>
    d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' })
      .split('/').reverse().join('-');

  const serviceNames = raw.appointment_services?.map((s: any) => s.service_name).join(' + ') || 'Serviço';

  return {
    id: raw.code || raw.id,
    client_id: raw.client_phone,
    client_name: raw.client_name,
    client_phone: raw.client_phone,
    client_email: raw.client_email || undefined,
    barber_id: raw.barber_id,
    barber_name: raw.barbers?.name || 'Barbeiro',
    service_ids: [],
    service_name: serviceNames,
    service_price: raw.total_price_cents / 100,
    service_duration: raw.total_duration,
    date: formatDate(startsAt),
    start_time: formatTime(startsAt),
    end_time: formatTime(endsAt),
    status: raw.status,
    created_at: raw.created_at
  };
}
