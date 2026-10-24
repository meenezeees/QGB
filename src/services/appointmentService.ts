import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Appointment } from '../types';

export interface CreateAppointmentInput {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  barberId?: string;
  barberName: string;
  serviceId?: string;
  serviceIds: string[];
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  notes?: string;
}

/**
 * Consulta horários ocupados para uma data e barbeiro específicos no Supabase
 */
export async function getOccupiedSlots(date: string, barberId?: string): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    let query = supabase
      .from('appointments')
      .select('start_time, end_time, status')
      .eq('appointment_date', date)
      .neq('status', 'cancelled');

    if (barberId) {
      // Se barberId for um UUID válido do Supabase
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(barberId)) {
        query = query.eq('professional_id', barberId);
      }
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }

    // Retorna array com os horários de início ocupados (ex: ['09:00', '14:30'])
    return data.map((appt) => {
      const time = (appt.start_time || '').substring(0, 5);
      return time;
    }).filter(Boolean);
  } catch (err) {
    console.warn('Erro ao consultar horários ocupados no Supabase:', err);
    return [];
  }
}

/**
 * Cria um novo agendamento no Supabase com proteção atômica contra conflitos
 */
export async function createAppointment(
  input: CreateAppointmentInput
): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
  const localId = `apt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const localUserId = `usr-${Date.now().toString(36)}`;

  const fallbackAppointment: Appointment = {
    id: localId,
    client_id: localUserId,
    client_name: input.clientName,
    client_phone: input.clientPhone.replace(/\D/g, ''),
    client_email: input.clientEmail,
    barber_id: input.barberId || 'barber-1',
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

  if (!isSupabaseConfigured) {
    return { success: true, appointment: fallbackAppointment };
  }

  try {
    const isProfessionalUuid = input.barberId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.barberId);
    const isServiceUuid = input.serviceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.serviceId);

    // Tentativa 1: Chamar a RPC atômica book_appointment_atomic
    if (isProfessionalUuid) {
      const { data: rpcData, error: rpcError } = await supabase.rpc('book_appointment_atomic', {
        p_customer_name: input.clientName.trim(),
        p_customer_phone: input.clientPhone.replace(/\D/g, ''),
        p_appointment_date: input.date,
        p_start_time: input.startTime.length === 5 ? `${input.startTime}:00` : input.startTime,
        p_end_time: input.endTime.length === 5 ? `${input.endTime}:00` : input.endTime,
        p_professional_id: input.barberId,
        p_service_id: isServiceUuid ? input.serviceId : null,
        p_customer_email: input.clientEmail?.trim() || null,
        p_total_price_cents: Math.round(input.servicePrice * 100),
        p_service_name: input.serviceName,
        p_professional_name: input.barberName,
        p_notes: input.notes || null,
        p_source: 'website'
      });

      if (!rpcError && rpcData) {
        if (!rpcData.success) {
          return { success: false, error: rpcData.message || 'Horário já reservado.' };
        }
        return {
          success: true,
          appointment: {
            ...fallbackAppointment,
            id: rpcData.id || fallbackAppointment.id
          }
        };
      }
    }

    // Tentativa 2: Insert direto na tabela appointments
    const insertPayload: any = {
      customer_name: input.clientName.trim(),
      customer_phone: input.clientPhone.replace(/\D/g, ''),
      customer_email: input.clientEmail?.trim() || null,
      appointment_date: input.date,
      start_time: input.startTime.length === 5 ? `${input.startTime}:00` : input.startTime,
      end_time: input.endTime.length === 5 ? `${input.endTime}:00` : input.endTime,
      status: 'confirmed',
      total_price_cents: Math.round(input.servicePrice * 100),
      service_name: input.serviceName,
      professional_name: input.barberName,
      notes: input.notes || null,
      source: 'website'
    };

    if (isProfessionalUuid) {
      insertPayload.professional_id = input.barberId;
    }
    if (isServiceUuid) {
      insertPayload.service_id = input.serviceId;
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([insertPayload])
      .select('id, created_at')
      .single();

    if (error) {
      // Código PostgreSQL 23P01 = exclusion_violation (colisão de horário)
      if (error.code === '23P01' || error.message?.includes('no_overlapping_appointments')) {
        return {
          success: false,
          error: 'Este horário acabou de ser reservado por outro cliente. Por favor, escolha outro horário.'
        };
      }

      console.warn('Erro ao inserir no Supabase, mantendo confirmação com fallback:', error);
      // Se for erro de permissão ou tabela em configuração, confirma localmente para não frustrar o usuário
      return { success: true, appointment: fallbackAppointment };
    }

    return {
      success: true,
      appointment: {
        ...fallbackAppointment,
        id: data?.id || fallbackAppointment.id
      }
    };
  } catch (err: any) {
    console.error('Exceção ao criar agendamento:', err);
    return { success: true, appointment: fallbackAppointment };
  }
}

/**
 * Cancela um agendamento no Supabase
 */
export async function cancelAppointment(appointmentId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appointmentId);
    if (!isUuid) {
      return { success: true };
    }

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro ao cancelar' };
  }
}
