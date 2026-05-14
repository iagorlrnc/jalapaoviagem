import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: Trip
        Insert: Omit<Trip, 'id' | 'created_at'>
        Update: Partial<Omit<Trip, 'id' | 'created_at'>>
      }
      reservations: {
        Row: Reservation
        Insert: Omit<Reservation, 'id' | 'created_at'>
        Update: Partial<Omit<Reservation, 'id' | 'created_at'>>
      }
    }
  }
}

export interface Trip {
  id: string
  created_at: string
  name: string
  description: string
  location: string
  duration_days: number
  price: number
  max_spots: number
  available_spots: number
  departure_date: string
  return_date: string
  image_url: string
  highlights: string[]
  difficulty: 'Fácil' | 'Moderado' | 'Difícil'
  includes: string[]
  is_active: boolean
}

export interface Reservation {
  id: string
  created_at: string
  trip_id: string
  trip_name: string
  client_name: string
  client_email: string
  client_phone: string
  client_cpf: string
  num_people: number
  total_price: number
  status: 'pendente' | 'confirmada' | 'cancelada'
  notes?: string
  departure_date: string
}
