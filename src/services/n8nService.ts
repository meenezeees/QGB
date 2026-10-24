import { Appointment } from '../types';

const defaultN8nUrl = 'https://athrmnzs.app.n8n.cloud/webhook/agendamento';
const configuredN8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
export const N8N_WEBHOOK_URL = (typeof configuredN8nUrl === 'string' && configuredN8nUrl.trim()) 
  ? configuredN8nUrl.trim() 
  : defaultN8nUrl;

export interface N8nAppointmentPayload {
  event: 'appointment_created' | 'appointment_cancelled' | 'appointment_updated';
  appointment_id: string;
  client_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  barber_id?: string;
  barber_name: string;
  service_ids?: string[];
  service_name: string;
  service_price: number;
  service_duration: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  source: string;
  created_at: string;
  timestamp: string;
}

/**
 * Envia notificação de agendamento para o webhook do n8n para iniciar o workflow
 */
export async function sendAppointmentToN8n(
  appointment: Appointment,
  event: 'appointment_created' | 'appointment_cancelled' = 'appointment_created'
): Promise<{ sent: boolean; status?: number; error?: string }> {
  const payload: N8nAppointmentPayload = {
    event,
    appointment_id: appointment.id,
    client_id: appointment.client_id,
    customer_name: appointment.client_name,
    customer_phone: appointment.client_phone,
    customer_email: appointment.client_email,
    barber_id: appointment.barber_id,
    barber_name: appointment.barber_name,
    service_ids: appointment.service_ids,
    service_name: appointment.service_name,
    service_price: appointment.service_price,
    service_duration: appointment.service_duration,
    appointment_date: appointment.date,
    start_time: appointment.start_time,
    end_time: appointment.end_time,
    status: appointment.status,
    source: 'website',
    created_at: appointment.created_at,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(`[QGB n8n Webhook] n8n respondeu com status ${response.status}:`, errText);
      return { sent: false, status: response.status, error: errText };
    }

    console.log('[QGB n8n Webhook] Agendamento enviado com sucesso para o n8n:', appointment.id);
    return { sent: true, status: response.status };
  } catch (err: any) {
    // Falha de rede ou CORS — loga aviso sem interromper a experiência do usuário
    console.warn('[QGB n8n Webhook] Não foi possível conectar ao n8n no momento:', err.message);
    return { sent: false, error: err.message };
  }
}
