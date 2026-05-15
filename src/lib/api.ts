import { supabase, Trip, Reservation, Destination, TeamMember, SiteSettings, ContactMessage } from './supabase'
import { mockTrips } from './mockData'

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string
  return url && url !== 'https://your-project.supabase.co'
}

export async function uploadImage(file: File): Promise<string | null> {
  if (!isSupabaseConfigured()) return null

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (error) {
    console.error('Erro ao fazer upload da imagem:', error.message)
    return null
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// ─── TRIPS ───────────────────────────────────────────────────────────────────

export async function getTrips(includeInactive = false): Promise<Trip[]> {
  if (!isSupabaseConfigured()) return mockTrips

  let query = supabase
    .from('trips')
    .select('*')
    .order('departure_date', { ascending: true })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erro ao buscar viagens do Supabase:', error.message)
    return []
  }
  
  return (data as Trip[]) || []
}

export async function createTrip(trip: Omit<Trip, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('trips').insert([trip]).select().single()
  return { data, error }
}

export async function updateTrip(id: string, trip: Partial<Trip>) {
  const { data, error } = await supabase.from('trips').update(trip).eq('id', id).select().single()
  return { data, error }
}

export async function deleteTrip(id: string) {
  const { error } = await supabase.from('trips').delete().eq('id', id)
  return { error }
}

// ─── DESTINATIONS ─────────────────────────────────────────────────────────────

export async function getDestinations(includeInactive = false): Promise<Destination[]> {
  if (!isSupabaseConfigured()) return []

  let query = supabase
    .from('destinations')
    .select('*')
    .order('order_index', { ascending: true })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) return []
  return data as Destination[]
}

export async function createDestination(dest: Omit<Destination, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('destinations').insert([dest]).select().single()
  return { data, error }
}

export async function updateDestination(id: string, dest: Partial<Destination>) {
  const { data, error } = await supabase.from('destinations').update(dest).eq('id', id).select().single()
  return { data, error }
}

export async function deleteDestination(id: string) {
  const { error } = await supabase.from('destinations').delete().eq('id', id)
  return { error }
}

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────

export async function getSettings(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured()) return null

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'contact_info')
    .single()

  if (error) return null
  return data as SiteSettings
}

export async function updateSettings(settings: Partial<SiteSettings>) {
  const { data, error } = await supabase
    .from('site_settings')
    .update(settings)
    .eq('id', 'contact_info')
    .select()
    .single()
  return { data, error }
}

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured()) return []

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) return []
  return data as TeamMember[]
}

export async function createTeamMember(member: Omit<TeamMember, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('team_members').insert([member]).select().single()
  return { data, error }
}

export async function updateTeamMember(id: string, member: Partial<TeamMember>) {
  const { data, error } = await supabase.from('team_members').update(member).eq('id', id).select().single()
  return { data, error }
}

export async function deleteTeamMember(id: string) {
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  return { error }
}

// ─── RESERVATIONS ─────────────────────────────────────────────────────────────

const LOCAL_KEY = 'jalapao_reservations'

function getLocalReservations(): Reservation[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLocalReservation(r: Reservation) {
  const all = getLocalReservations()
  all.push(r)
  localStorage.setItem(LOCAL_KEY, JSON.stringify(all))
}

export async function createReservation(
  data: Omit<Reservation, 'id' | 'created_at'>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    const reservation: Reservation = {
      ...data,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    saveLocalReservation(reservation)
    return { success: true }
  }

  const { error } = await supabase.from('reservations').insert([data])
  
  if (error) {
    console.error('Erro ao criar reserva no Supabase:', error)
    if (error.code === '23503') {
      return { 
        success: false, 
        error: 'Esta viagem não está cadastrada no banco de dados. Por favor, cadastre as viagens no Supabase primeiro.' 
      }
    }
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

export async function getAllReservations(): Promise<Reservation[]> {
  if (!isSupabaseConfigured()) {
    return getLocalReservations()
  }

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return getLocalReservations()
  }
  
  return (data as Reservation[]) || []
}

export async function updateReservationStatus(
  id: string,
  status: Reservation['status']
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    const all = getLocalReservations()
    const idx = all.findIndex(r => r.id === id)
    if (idx !== -1) {
      all[idx].status = status
      localStorage.setItem(LOCAL_KEY, JSON.stringify(all))
    }
    return { success: true }
  }

  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)

  return { success: !error }
}

export async function deleteReservation(id: string): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    const all = getLocalReservations().filter(r => r.id !== id)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all))
    return { success: true }
  }

  const { error } = await supabase.from('reservations').delete().eq('id', id)
  return { success: !error }
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

const MSG_LOCAL_KEY = 'jalapao_messages'

function getLocalMessages(): ContactMessage[] {
  try {
    return JSON.parse(localStorage.getItem(MSG_LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLocalMessage(m: ContactMessage) {
  const all = getLocalMessages()
  all.push(m)
  localStorage.setItem(MSG_LOCAL_KEY, JSON.stringify(all))
}

export async function sendMessage(data: Omit<ContactMessage, 'id' | 'created_at' | 'status' | 'is_archived'>) {
  if (!isSupabaseConfigured()) {
    const msg: ContactMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'unread',
      is_archived: false
    }
    saveLocalMessage(msg)
    return { success: true }
  }

  const { error } = await supabase.from('messages').insert([data])
  return { success: !error, error }
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) {
    return getLocalMessages().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Erro ao buscar mensagens do Supabase:', error.message)
    return getLocalMessages().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }
  
  return data as ContactMessage[]
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']) {
  if (!isSupabaseConfigured() || id.startsWith('msg-')) {
    const all = getLocalMessages()
    const idx = all.findIndex(m => m.id === id)
    if (idx !== -1) {
      all[idx].status = status
      localStorage.setItem(MSG_LOCAL_KEY, JSON.stringify(all))
    }
    return { success: true }
  }

  const { error } = await supabase.from('messages').update({ status }).eq('id', id)
  return { success: !error, error }
}

export async function deleteMessage(id: string) {
  if (!isSupabaseConfigured() || id.startsWith('msg-')) {
    const all = getLocalMessages().filter(m => m.id !== id)
    localStorage.setItem(MSG_LOCAL_KEY, JSON.stringify(all))
    return { success: true }
  }

  const { error } = await supabase.from('messages').delete().eq('id', id)
  return { success: !error, error }
}
