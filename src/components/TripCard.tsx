import { useState } from 'react'
import { Calendar, Users, Clock, ChevronRight, Star, AlertCircle } from 'lucide-react'
import { Trip } from '../lib/supabase'
import { ReservationModal } from './ReservationModal'

interface TripCardProps {
  trip: Trip
}

const difficultyColor = {
  Fácil: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Moderado: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  Difícil: 'text-red-400 border-red-400/30 bg-red-400/10',
}

export function TripCard({ trip }: TripCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const spotsLeft = trip.available_spots
  const isSoldOut = spotsLeft === 0
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 3

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <>
      <div className="group relative flex flex-col border border-black/5 hover:border-[#c98228]/30 
                      transition-all duration-500 overflow-hidden bg-white shadow-sm hover:shadow-xl 
                      rounded-[2rem]">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: '220px' }}>
          <div
            className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110"
            style={{
              backgroundImage: `url('${trip.image_url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1
                              border font-bold ${difficultyColor[trip.difficulty]}`}>
              {trip.difficulty}
            </span>
            {isSoldOut && (
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1
                               bg-red-900/80 text-red-300 border border-red-500/30 font-bold">
                Esgotado
              </span>
            )}
            {isAlmostFull && !isSoldOut && (
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1
                               bg-orange-900/80 text-orange-300 border border-orange-500/30 font-bold flex items-center gap-1">
                <AlertCircle size={10} /> Últimas vagas
              </span>
            )}
          </div>

          {/* Price badge */}
          <div className="absolute bottom-4 right-4 z-10 text-right">
            <div className="font-body text-white/60 text-xs uppercase tracking-widest">a partir de</div>
            <div className="font-display text-2xl font-bold text-gradient">
              {formatPrice(trip.price)}
            </div>
            <div className="font-body text-white/60 text-xs uppercase tracking-widest">por pessoa</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-display text-xl font-bold text-night group-hover:text-[#c98228] 
                           transition-colors duration-300">
              {trip.name}
            </h3>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={10} className="fill-[#c98228] text-[#c98228]" />
              ))}
            </div>
          </div>

          <p className="font-body text-night/60 text-sm leading-relaxed mb-4 line-clamp-2">
            {trip.description}
          </p>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-night/50">
              <Calendar size={13} className="text-[#c98228] flex-shrink-0" />
              <span className="font-mono text-xs">{formatDate(trip.departure_date)}</span>
            </div>
            <div className="flex items-center gap-2 text-night/50">
              <Clock size={13} className="text-[#c98228] flex-shrink-0" />
              <span className="font-mono text-xs">{trip.duration_days} dias</span>
            </div>
            <div className="flex items-center gap-2 text-night/50 col-span-2">
              <Users size={13} className="text-[#c98228] flex-shrink-0" />
              <span className="font-mono text-xs">
                {isSoldOut
                  ? 'Sem vagas disponíveis'
                  : `${spotsLeft} vaga${spotsLeft !== 1 ? 's' : ''} restante${spotsLeft !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Spots bar */}
          <div className="mb-4">
            <div className="h-1 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c98228] to-[#e8c070] transition-all duration-500"
                style={{ width: `${((trip.max_spots - spotsLeft) / trip.max_spots) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[10px] text-night/30">
                {trip.max_spots - spotsLeft}/{trip.max_spots} reservas
              </span>
              <span className="font-mono text-[10px] text-night/30">
                {Math.round(((trip.max_spots - spotsLeft) / trip.max_spots) * 100)}% preenchido
              </span>
            </div>
          </div>

          {/* Toggle details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-[#c98228] font-mono text-xs 
                       uppercase tracking-widest mb-4 hover:text-[#e8c070] transition-colors"
          >
            <ChevronRight
              size={14}
              className={`transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`}
            />
            {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
          </button>

          {showDetails && (
            <div className="mb-4 space-y-4 border-t border-black/5 pt-4">
              {/* Highlights */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] mb-2">
                  Destaques
                </p>
                  <div className="flex flex-wrap gap-2">
                    {trip.highlights.map(h => (
                      <span key={h}
                        className="font-body text-[10px] uppercase tracking-wider text-[#c98228] bg-[#c98228]/5 
                                   border border-[#c98228]/10 px-3 py-1 rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
              </div>

              {/* Includes */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] mb-2">
                  Inclui
                </p>
                <ul className="space-y-1">
                  {trip.includes.map(inc => (
                    <li key={inc} className="flex items-center gap-2 font-body text-xs text-night/50">
                      <span className="w-1 h-1 bg-[#c98228] rounded-full flex-shrink-0" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between font-mono text-xs text-night/30">
                <span>Retorno: {formatDate(trip.return_date)}</span>
                <span>{trip.location}</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => !isSoldOut && setShowModal(true)}
            disabled={isSoldOut}
            className={`mt-auto w-full py-4 font-bold uppercase tracking-widest text-xs
                        transition-all duration-300 relative overflow-hidden
                        ${isSoldOut
                          ? 'bg-black/5 text-night/30 cursor-not-allowed border border-black/5'
                          : 'btn-primary'
                        }`}
          >
            {isSoldOut ? 'Viagem Esgotada' : 'Reservar Esta Viagem'}
          </button>
        </div>
      </div>

      {showModal && (
        <ReservationModal trip={trip} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
