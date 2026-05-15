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
      destinations: {
        Row: Destination
        Insert: Omit<Destination, 'id' | 'created_at'>
        Update: Partial<Omit<Destination, 'id' | 'created_at'>>
      }
      team_members: {
        Row: TeamMember
        Insert: Omit<TeamMember, 'id' | 'created_at'>
        Update: Partial<Omit<TeamMember, 'id' | 'created_at'>>
      }
      site_settings: {
        Row: SiteSettings
        Insert: SiteSettings
        Update: Partial<SiteSettings>
      }
      messages: {
        Row: ContactMessage
        Insert: Omit<ContactMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at'>>
      }
    }
  }
}

export interface ContactMessage {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: 'unread' | 'read' | 'archived'
  is_archived: boolean
}

export interface SiteSettings {
  id: string
  whatsapp: string
  email: string
  address: string
  working_hours: string
  instagram_url: string
  facebook_url: string
  maps_url?: string
  updated_at?: string
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

export interface Destination {
  id: string
  created_at: string
  name: string
  description: string
  tag: string
  image_url: string
  rating: number
  is_active: boolean
  order_index: number
}

export interface TeamMember {
  id: string
  created_at: string
  name: string
  role: string
  years_experience: string
  image_url?: string
  order_index: number
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
