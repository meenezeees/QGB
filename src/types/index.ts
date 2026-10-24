export type ServiceCategory = 
  | 'Combos Promocionais'
  | 'Cortes Tradicionais'
  | 'Barboterapia'
  | 'Química & Coloração'
  | 'Tratamentos'
  | 'Acabamentos & Estilo';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number; // minutos
  category: ServiceCategory;
  description: string;
  image_url?: string;
  popular?: boolean;
  active: boolean;
}

export interface BarberItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialty: string;
  bio: string;
  photo_url?: string;
  active: boolean;
  service_ids: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: 'Cabelo' | 'Barba' | 'Tratamentos' | 'Finalizadores';
  suggestedPrice: number;
  image_url?: string;
}

export interface MonthlyPlanBenefit {
  id: string;
  title: string;
  description: string;
  highlighted: boolean;
  badge?: string;
  iconName: 'Sparkles' | 'Star' | 'Clock' | 'RefreshCw';
}

export interface Appointment {
  id: string;
  client_id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  barber_id: string;
  barber_name: string;
  service_ids: string[];
  service_name: string;
  service_price: number;
  service_duration: number;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  created_at: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export type UserRole = 'client' | 'barber' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface BarbershopSettings {
  name: string;
  logo_url: string;
  description: string;
  address: string;
  whatsapp: string;
  instagram: string;
  instagramUrl: string;
  tiktok: string;
  tiktokUrl: string;
  googleMapsUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  tag: string;
  img: string;
}

export interface EnvironmentItem {
  id: string;
  title: string;
  description: string;
  img: string;
}
