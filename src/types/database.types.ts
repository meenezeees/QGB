export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'client' | 'barber' | 'admin';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          price_cents: number;
          duration_minutes: number;
          image_url: string | null;
          popular: boolean;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: string;
          description?: string | null;
          price_cents: number;
          duration_minutes: number;
          image_url?: string | null;
          popular?: boolean;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          price_cents?: number;
          duration_minutes?: number;
          image_url?: string | null;
          popular?: boolean;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          role: UserRole;
          lgpd_consent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          role?: UserRole;
          lgpd_consent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          role?: UserRole;
          lgpd_consent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      barbers: {
        Row: {
          id: string;
          profile_id: string | null;
          name: string;
          specialty: string | null;
          bio: string | null;
          photo_url: string | null;
          whatsapp_public: string | null;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          profile_id?: string | null;
          name: string;
          specialty?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          whatsapp_public?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          name?: string;
          specialty?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          whatsapp_public?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      barber_services: {
        Row: {
          barber_id: string;
          service_id: string;
        };
        Insert: {
          barber_id: string;
          service_id: string;
        };
        Update: {
          barber_id?: string;
          service_id?: string;
        };
        Relationships: [];
      };
      business_hours: {
        Row: {
          weekday: number;
          is_open: boolean;
          opens_at: string | null;
          closes_at: string | null;
          break_start: string | null;
          break_end: string | null;
          slot_minutes: number;
        };
        Insert: {
          weekday: number;
          is_open?: boolean;
          opens_at?: string | null;
          closes_at?: string | null;
          break_start?: string | null;
          break_end?: string | null;
          slot_minutes?: number;
        };
        Update: {
          weekday?: number;
          is_open?: boolean;
          opens_at?: string | null;
          closes_at?: string | null;
          break_start?: string | null;
          break_end?: string | null;
          slot_minutes?: number;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          code: string;
          client_profile_id: string | null;
          client_name: string;
          client_phone: string;
          client_email: string | null;
          lgpd_consent_at: string;
          barber_id: string;
          starts_at: string;
          ends_at: string;
          total_price_cents: number;
          total_duration: number;
          status: AppointmentStatus;
          cancelled_at: string | null;
          cancelled_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          client_profile_id?: string | null;
          client_name: string;
          client_phone: string;
          client_email?: string | null;
          lgpd_consent_at?: string;
          barber_id: string;
          starts_at: string;
          ends_at: string;
          total_price_cents: number;
          total_duration: number;
          status?: AppointmentStatus;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          client_profile_id?: string | null;
          client_name?: string;
          client_phone?: string;
          client_email?: string | null;
          lgpd_consent_at?: string;
          barber_id?: string;
          starts_at?: string;
          ends_at?: string;
          total_price_cents?: number;
          total_duration?: number;
          status?: AppointmentStatus;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      appointment_services: {
        Row: {
          appointment_id: string;
          service_id: string;
          service_name: string;
          price_cents: number;
          duration_minutes: number;
        };
        Insert: {
          appointment_id: string;
          service_id: string;
          service_name: string;
          price_cents: number;
          duration_minutes: number;
        };
        Update: {
          appointment_id?: string;
          service_id?: string;
          service_name?: string;
          price_cents?: number;
          duration_minutes?: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_appointment: {
        Args: {
          p_client_name: string;
          p_client_phone: string;
          p_client_email?: string | null;
          p_barber_id: string;
          p_service_ids: string[];
          p_date: string;
          p_start_time: string;
          p_client_profile_id?: string | null;
        };
        Returns: Json;
      };
      get_busy_slots: {
        Args: {
          p_date: string;
          p_barber_id?: string | null;
        };
        Returns: {
          barber_id: string;
          start_time: string;
          end_time: string;
          starts_at: string;
          ends_at: string;
        }[];
      };
      cancel_appointment: {
        Args: {
          p_appointment_id: string;
          p_client_phone?: string | null;
        };
        Returns: boolean;
      };
      get_admin_metrics: {
        Args: Record<string, never>;
        Returns: {
          today_appointments: number;
          total_clients: number;
          active_barbers: number;
          total_revenue_cents: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      appointment_status: AppointmentStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
