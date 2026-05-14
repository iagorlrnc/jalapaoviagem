import { supabase, Trip, Reservation } from './supabase'
import { mockTrips } from './mockData'

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string
  return url && url !== 'https://your-project.supabase.co'
}

// ─── TRIPS ───────────────────────────────────────────────────────────────────

export async function getTrips(): Promise<Trip[]> {
  if (!isSupabaseConfigured()) return mockTrips

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('is_active', true)
    .order('departure_date', { ascending: true })

  if (error) {
    console.error('Erro ao buscar viagens do Supabase:', error.message)
    if (error.code === '42P01') {
      console.warn('Dica: A tabela "trips" não foi encontrada. Certifique-se de executar o script SQL no Supabase.')
    }
    return mockTrips
  }
  
  if (!data || data.length === 0) {
    console.warn('A tabela "trips" está vazia. Usando dados locais para demonstração.')
    return mockTrips
  }

  return data as Trip[]
}

export async function getTripById(id: string): Promise<Trip | null> {
  if (!isSupabaseConfigured()) {
    return mockTrips.find(t => t.id === id) || null
  }

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Trip
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
    
    // Se o erro for de chave estrangeira, significa que a viagem não existe no banco
    if (error.code === '23503') {
      return { 
        success: false, 
        error: 'Esta viagem não está cadastrada no banco de dados. Por favor, cadastre as viagens no Supabase primeiro.' 
      }
    }
    
    return { success: false, error: error.message }
  }
  
  console.log('Reserva criada com sucesso no Supabase!')
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
    console.warn('Erro no Supabase, usando local:', error.message)
    return getLocalReservations()
  }
  
  const reservations = (data as Reservation[]) || []
  console.log(`[Admin] Buscadas ${reservations.length} reservas do Supabase.`)
  return reservations
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
