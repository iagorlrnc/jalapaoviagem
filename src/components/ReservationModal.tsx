import { useState } from 'react'
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { Trip } from '../lib/supabase'
import { createReservation } from '../lib/api'

interface Props {
  trip: Trip
  onClose: () => void
}

export function ReservationModal({ trip, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_cpf: '',
    num_people: 1,
    notes: '',
  })

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const totalPrice = trip.price * form.num_people

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'num_people' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async () => {
    if (!form.client_name || !form.client_email || !form.client_phone || !form.client_cpf) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.')
      return
    }
    setErrorMsg('')
    setLoading(true)

    const result = await createReservation({
      trip_id: trip.id,
      trip_name: trip.name,
      client_name: form.client_name,
      client_email: form.client_email,
      client_phone: form.client_phone,
      client_cpf: form.client_cpf,
      num_people: form.num_people,
      total_price: totalPrice,
      status: 'pendente',
      notes: form.notes || undefined,
      departure_date: trip.departure_date,
    })

    setLoading(false)
    if (result.success) {
      setStep('success')
    } else {
      setStep('error')
      setErrorMsg(result.error || 'Erro ao criar reserva. Tente novamente.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-white border border-black/10 
                      overflow-y-auto max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-black/5">
          <div>
            <p className="section-label mb-1">✦ Reserva de Viagem</p>
            <h2 className="font-display text-2xl font-bold text-night">{trip.name}</h2>
            <p className="font-mono text-xs text-night/40 mt-1">
              {new Date(trip.departure_date + 'T00:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-night/40 hover:text-night transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {step === 'form' && (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-night/40 block mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={form.client_name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="input-field"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-night/40 block mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="client_email"
                  value={form.client_email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-night/40 block mb-2">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="client_phone"
                  value={form.client_phone}
                  onChange={handleChange}
                  placeholder="(63) 99999-9999"
                  className="input-field"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-night/40 block mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  name="client_cpf"
                  value={form.client_cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="input-field"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-night/40 block mb-2">
                  Número de Pessoas *
                </label>
                <select
                  name="num_people"
                  value={form.num_people}
                  onChange={handleChange}
                  className="input-field"
                >
                  {Array.from({ length: Math.min(trip.available_spots, 6) }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} pessoa{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-night/40 block mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Restrições alimentares, necessidades especiais, dúvidas..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-sand-50 border border-black/5 p-4 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228]">
                Resumo do Pedido
              </p>
              <div className="flex justify-between font-body text-sm text-night/60">
                <span>{form.num_people} × {trip.name}</span>
                <span>{formatPrice(trip.price)} / pessoa</span>
              </div>
              <div className="border-t border-black/5 pt-3 flex justify-between">
                <span className="font-display font-bold text-night">Total</span>
                <span className="font-display text-xl font-bold text-gradient">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="font-mono text-[10px] text-night/30">
                * O pagamento será confirmado via WhatsApp após a reserva.
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 
                              border border-red-200 p-3">
                <AlertCircle size={16} />
                <span className="font-body text-sm">{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="btn-outline flex-1 py-3 text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Enviando...</>
                ) : (
                  'Confirmar Reserva'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 border border-emerald-200 bg-emerald-50 
                            flex items-center justify-center">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-night mb-2">
                Reserva Enviada!
              </h3>
              <p className="font-body text-night/50 text-sm leading-relaxed max-w-sm">
                Sua solicitação para <strong className="text-night">{trip.name}</strong> foi recebida.
                Nossa equipe entrará em contato via WhatsApp em até 24 horas para confirmar e 
                finalizar o pagamento.
              </p>
            </div>
            <div className="bg-sand-50 border border-black/5 p-4 w-full text-left space-y-2">
              <p className="font-mono text-[10px] text-[#c98228] uppercase tracking-widest mb-3">
                Detalhes da Reserva
              </p>
              <div className="flex justify-between font-body text-sm">
                <span className="text-night/40">Nome</span>
                <span className="text-night">{form.client_name}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-night/40">Viagem</span>
                <span className="text-night">{trip.name}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-night/40">Pessoas</span>
                <span className="text-night">{form.num_people}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-night/40">Total</span>
                <span className="text-gradient font-bold">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary px-12">
              Fechar
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="p-12 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 border border-red-200 bg-red-50 
                            flex items-center justify-center">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-night mb-2">Erro na Reserva</h3>
              <p className="font-body text-night/50 text-sm">{errorMsg}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('form')} className="btn-outline px-8">
                Tentar Novamente
              </button>
              <button onClick={onClose} className="btn-primary px-8">
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
