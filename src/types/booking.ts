export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  category: string;
  active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  special_requests: string | null;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface BookingData {
  services: Service[];
  date: Date | null;
  time: string | null;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  specialRequests: string;
}

export const initialBookingData: BookingData = {
  services: [],
  date: null,
  time: null,
  clientFirstName: "",
  clientLastName: "",
  clientEmail: "",
  clientPhone: "",
  specialRequests: "",
};

export const totalDuration = (services: Service[]): number =>
  services.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

export const totalPrice = (services: Service[]): number =>
  services.reduce((sum, s) => sum + (s.price || 0), 0);
