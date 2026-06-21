export type UserRole = "client" | "agency" | "admin";
export type AgencyStatus = "pending" | "active" | "suspended";
export type BookingStatus = "en_attente" | "confirmee" | "refusee" | "expiree" | "activee" | "terminee";
export type VehicleCategory = "Citadine" | "Berline" | "SUV" | "Prestige";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
        };
      };
      agencies: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          city: string;
          phone: string | null;
          email: string | null;
          address: string | null;
          coordinates: Record<string, unknown> | null;
          opening_hours: Record<string, unknown> | null;
          facade_photo_url: string | null;
          rating: number;
          review_count: number;
          status: AgencyStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          city?: string;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          coordinates?: Record<string, unknown> | null;
          opening_hours?: Record<string, unknown> | null;
          facade_photo_url?: string | null;
          rating?: number;
          review_count?: number;
          status?: AgencyStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          city?: string;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          coordinates?: Record<string, unknown> | null;
          opening_hours?: Record<string, unknown> | null;
          facade_photo_url?: string | null;
          rating?: number;
          review_count?: number;
          status?: AgencyStatus;
          created_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          agency_id: string;
          brand: string;
          model: string;
          year: number;
          fuel_type: string;
          gearbox: string;
          daily_price: number;
          deposit_amount: number | null;
          mileage_policy: string | null;
          fuel_policy: string | null;
          photos: string[];
          category: VehicleCategory;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          brand: string;
          model: string;
          year: number;
          fuel_type: string;
          gearbox: string;
          daily_price: number;
          deposit_amount?: number | null;
          mileage_policy?: string | null;
          fuel_policy?: string | null;
          photos?: string[];
          category?: VehicleCategory;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          brand?: string;
          model?: string;
          year?: number;
          fuel_type?: string;
          gearbox?: string;
          daily_price?: number;
          deposit_amount?: number | null;
          mileage_policy?: string | null;
          fuel_policy?: string | null;
          photos?: string[];
          category?: VehicleCategory;
          is_available?: boolean;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          vehicle_id: string;
          client_name: string;
          client_phone: string;
          client_email: string;
          client_license_number: string;
          start_date: string;
          end_date: string;
          total_price: number | null;
          status: BookingStatus;
          unique_code: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          client_name: string;
          client_phone: string;
          client_email: string;
          client_license_number: string;
          start_date: string;
          end_date: string;
          status?: BookingStatus;
          unique_code?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          client_name?: string;
          client_phone?: string;
          client_email?: string;
          client_license_number?: string;
          start_date?: string;
          end_date?: string;
          status?: BookingStatus;
          unique_code?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
