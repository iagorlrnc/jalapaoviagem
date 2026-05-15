import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Trip, SiteSettings } from '../lib/supabase'
import { getTrips, getSettings } from '../lib/api'
import { TripCard } from './TripCard'

export function TripsSection() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'Todos' | 'Fácil' | 'Moderado' | 'Difícil'>('Todos')

  useEffect(() => {
    Promise.all([getTrips(), getSettings()]).then(([tripData, settingsData]) => {
      setTrips(tripData)
      setSettings(settingsData)
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'Todos' ? trips : trips.filter(t => t.difficulty === filter)

  return (
    <section id="viagens" className="py-32 px-6 bg-dusk relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c98228]/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="section-label">✦ Viagens Disponíveis</p>
            <h2 className="display-heading text-5xl md:text-6xl font-black">
              Escolha sua<br />
              <span className="text-gradient">aventura</span>
            </h2>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['Todos', 'Fácil', 'Moderado', 'Difícil'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-xs uppercase tracking-widest px-4 py-2 
                            border transition-all duration-200
                            ${filter === f
                              ? 'bg-[#c98228] text-white border-[#c98228] font-bold'
                              : 'border-black/10 text-night/40 hover:border-[#c98228]/50 hover:text-[#c98228]'
                            }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-night/40">
            <Loader2 size={24} className="animate-spin text-[#c98228]" />
            <span className="font-body">Carregando viagens...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 text-night/30 font-body">
            Nenhuma viagem disponível nesta categoria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        {/* Bottom note */}
        <div className="mt-16 border border-black/5 bg-white/40 backdrop-blur-sm p-8 flex flex-col md:flex-row items-center 
                        justify-between gap-6">
          <div>
            <p className="font-display text-lg font-bold text-night mb-1">
              Quer uma viagem personalizada?
            </p>
            <p className="font-body text-night/40 text-sm">
              Montamos roteiros exclusivos para grupos, famílias e empresas.
            </p>
          </div>
          <a
            href={settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline whitespace-nowrap"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
