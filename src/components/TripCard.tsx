import { useState } from 'react'
import { Calendar, Users, Clock, ChevronRight, Star, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
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
  const [modalStep, setModalStep] = useState<'summary' | 'itinerary' | 'price'>('summary')
  const [currentDayIdx, setCurrentDayIdx] = useState(0)

  const spotsLeft = trip.available_spots
  const isSoldOut = spotsLeft === 0
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 3

  const nextStep = () => {
    if (modalStep === 'summary') {
      if (trip.itinerary && trip.itinerary.length > 0) {
        setModalStep('itinerary')
        setCurrentDayIdx(0)
      } else {
        setModalStep('price')
      }
    } else if (modalStep === 'itinerary') {
      if (currentDayIdx < (trip.itinerary?.length || 0) - 1) {
        setCurrentDayIdx(prev => prev + 1)
      } else {
        setModalStep('price')
      }
    }
  }

  const prevStep = () => {
    if (modalStep === 'price') {
      if (trip.itinerary && trip.itinerary.length > 0) {
        setModalStep('itinerary')
        setCurrentDayIdx(trip.itinerary.length - 1)
      } else {
        setModalStep('summary')
      }
    } else if (modalStep === 'itinerary') {
      if (currentDayIdx > 0) {
        setCurrentDayIdx(prev => prev - 1)
      } else {
        setModalStep('summary')
      }
    }
  }

  const resetModal = () => {
    setShowDetails(false)
    setModalStep('summary')
    setCurrentDayIdx(0)
  }

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
              {[1, 2, 3, 4, 5].map(s => (
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
            onClick={() => setShowDetails(true)}
            className="flex items-center justify-center gap-2 w-full py-3 mb-3
                       border border-[#c98228]/30 text-[#c98228] font-mono text-[10px] 
                       uppercase tracking-widest rounded-xl hover:bg-sand-50 
                       hover:border-[#c98228] transition-all duration-300"
          >
            <Clock size={12} />
            Ver detalhes e roteiro
          </button>

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
        <ReservationModal 
          trip={trip} 
          onClose={() => setShowModal(false)} 
          onShowDetails={() => {
            setShowModal(false);
            setShowDetails(true);
          }}
        />
      )}

      {showDetails && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={resetModal} />
          <div className="relative z-10 w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Left: Image */}
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <img src={trip.image_url} alt={trip.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h2 className="font-display text-4xl font-bold text-white mb-2">{trip.name}</h2>
                  <div className="flex items-center gap-4 text-white/80 font-mono text-xs uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-[#c98228]" /> {formatDate(trip.departure_date)}</span>
                    <span className="flex items-center gap-2"><Clock size={14} className="text-[#c98228]" /> {trip.duration_days} Dias</span>
                  </div>
                </div>
                <button
                  onClick={resetModal}
                  className="absolute top-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
                >
                  <ChevronRight className="rotate-180" size={20} />
                </button>
              </div>

              {/* Right: Info */}
              <div className="md:w-1/2 p-6 overflow-y-auto bg-white flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold mb-1">
                      {modalStep === 'summary' && 'Sobre esta jornada'}
                      {modalStep === 'itinerary' && `Roteiro - ${trip.itinerary?.[currentDayIdx]?.title || ''}`}
                      {modalStep === 'price' && 'Investimento e Reserva'}
                    </p>
                    {modalStep === 'summary' && (
                      <span className={`inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-1 border font-bold ${difficultyColor[trip.difficulty]}`}>
                        Dificuldade {trip.difficulty}
                      </span>
                    )}
                  </div>
                  {modalStep === 'summary' && (
                    <div className="text-right">
                      <p className="font-display text-3xl font-bold text-gradient">{formatPrice(trip.price)}</p>
                      <p className="font-body text-night/40 text-[10px] uppercase tracking-widest">por pessoa</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex-1 min-h-[300px]">
                  {modalStep === 'summary' && (
                    <>
                      <div>
                        <p className="font-body text-night/70 text-sm leading-relaxed">
                          {trip.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold mb-4">O que está incluído</p>
                          <ul className="grid grid-cols-1 gap-3">
                            {trip.includes.map(inc => (
                              <li key={inc} className="flex items-center gap-3 font-body text-xs text-night/60">
                                <div className="w-5 h-5 bg-sand-50 rounded-lg flex items-center justify-center shrink-0">
                                  <CheckCircle size={12} className="text-[#c98228]" />
                                </div>
                                {inc}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold mb-4">Destaques rápidos</p>
                          <div className="flex flex-wrap gap-2">
                            {trip.highlights.map(h => (
                              <span key={h} className="font-body text-[10px] uppercase tracking-wider text-[#c98228]/60 bg-sand-50/50 px-3 py-1.5 rounded-lg">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {modalStep === 'itinerary' && trip.itinerary && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                      <h4 className="font-display text-2xl font-bold text-night mb-4">{trip.itinerary[currentDayIdx].title}</h4>
                      <ul className="space-y-4">
                        {trip.itinerary[currentDayIdx].items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-4 font-body text-sm text-night/60 leading-relaxed">
                            <div className="w-6 h-6 rounded-full bg-sand-50 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#c98228]" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {modalStep === 'price' && (
                    <div className="animate-in slide-in-from-right-4 duration-300 space-y-4">
                      <div className="p-6 bg-sand-50 rounded-[2.5rem] border border-[#c98228]/10 text-center">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-night/40 mb-2">Valor do pacote</p>
                        <p className="font-display text-4xl font-bold text-[#c98228]">{formatPrice(trip.price)}</p>
                        <p className="font-body text-[10px] text-night/40 mt-1">Pagamento seguro via PIX ou Cartão</p>
                      </div>

                      <div className="space-y-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold">Formas de Pagamento</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white border border-black/5 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs">PIX</div>
                            <span className="font-body text-xs text-night/60">À vista com desconto</span>
                          </div>
                          <div className="p-4 bg-white border border-black/5 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">CC</div>
                            <span className="font-body text-xs text-night/60">Até 12x no cartão</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-black/5 rounded-2xl border border-black/5">
                        <p className="font-body text-[11px] text-night/40 leading-relaxed">
                          * Reservas sujeitas a disponibilidade. O valor inclui todos os itens listados na aba de resumo. Cancelamento gratuito até 30 dias antes da partida.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-black/5 flex flex-col gap-3">
                  {modalStep === 'summary' && (
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="font-mono text-[10px] text-night/30 uppercase mb-1">Localização</p>
                        <p className="font-body text-xs text-night/60 font-bold">{trip.location}</p>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-mono text-[10px] text-night/30 uppercase mb-1">Retorno Previsto</p>
                        <p className="font-body text-xs text-night/60 font-bold">{formatDate(trip.return_date)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {modalStep !== 'summary' && (
                      <button
                        onClick={prevStep}
                        className="flex-1 py-4 border border-black/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-night/40 hover:bg-black/5 hover:text-night transition-all"
                      >
                        Voltar
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (modalStep === 'price') {
                          resetModal();
                          setShowModal(true);
                        } else {
                          nextStep();
                        }
                      }}
                      disabled={isSoldOut}
                      className={`${modalStep !== 'summary' ? 'flex-[2]' : 'w-full'} py-4 btn-primary rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-sand-500/20`}
                    >
                      {isSoldOut ? 'Esgotado' : (
                        <>
                          {modalStep === 'summary' && (trip.itinerary?.length > 0 ? 'Ver Roteiro' : 'Ver Valor')}
                          {modalStep === 'itinerary' && (currentDayIdx < (trip.itinerary?.length || 0) - 1 ? 'Próximo Dia' : 'Ver Valor')}
                          {modalStep === 'price' && 'Quero Reservar Agora'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
