import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Trip } from '../lib/supabase'
import { getTrips } from '../lib/api'
import { TripCard } from './TripCard'

export function TripsSection() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'Todos' | 'Fácil' | 'Moderado' | 'Difícil'>('Todos')

  useEffect(() => {
    getTrips().then(data => {
      setTrips(data)
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'Todos' ? trips : trips.filter(t => t.difficulty === filter)

  return (
    <section id="viagens" className="py-32 px-6 bg-[#0d0c09] relative">
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
                              ? 'bg-[#c98228] text-[#0f0e0a] border-[#c98228] font-bold'
                              : 'border-white/20 text-white/40 hover:border-[#c98228]/50 hover:text-white/70'
                            }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-white/40">
            <Loader2 size={24} className="animate-spin text-[#c98228]" />
            <span className="font-body">Carregando viagens...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 text-white/30 font-body">
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
        <div className="mt-16 border border-white/10 p-8 flex flex-col md:flex-row items-center 
                        justify-between gap-6">
          <div>
            <p className="font-display text-lg font-bold text-white mb-1">
              Quer uma viagem personalizada?
            </p>
            <p className="font-body text-white/40 text-sm">
              Montamos roteiros exclusivos para grupos, famílias e empresas.
            </p>
          </div>
          <a
            href="https://wa.me/556399999999?text=Olá!%20Quero%20um%20roteiro%20personalizado%20para%20o%20Jalapão."
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
