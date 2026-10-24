export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price_cents: number;
          duration_minutes: number;
          category: string | null;
          image_url: string | null;
          popular: boolean;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price_cents: number;
          duration_minutes: number;
          category?: string | null;
          image_url?: string | null;
          popular?: boolean;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price_cents?: number;
          duration_minutes?: number;
          category?: string | null;
          image_url?: string | null;
          popular?: boolean;
          active?: boolean;
          created_at?: string;
        };
      };
      professionals: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email: string | null;
          specialty: string | null;
          bio: string | null;
          photo_url: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          specialty?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          specialty?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: 'client' | 'barber' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'client' | 'barber' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'client' | 'barber' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          user_id: string | null;
          professional_id: string | null;
          service_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
          total_price_cents: number | null;
          service_name: string | null;
          professional_name: string | null;
          notes: string | null;
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          professional_id?: string | null;
          service_id?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status?: 'confirmed' | 'cancelled' | 'completed' | 'pending';
          total_price_cents?: number | null;
          service_name?: string | null;
          professional_name?: string | null;
          notes?: string | null;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          professional_id?: string | null;
          service_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          appointment_date?: string;
          start_time?: string;
          end_time?: string;
          status?: 'confirmed' | 'cancelled' | 'completed' | 'pending';
          total_price_cents?: number | null;
          service_name?: string | null;
          professional_name?: string | null;
          notes?: string | null;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
