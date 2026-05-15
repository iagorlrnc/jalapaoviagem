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

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    let formattedValue = value
    if (name === 'client_cpf') formattedValue = maskCPF(value)
    if (name === 'client_phone') formattedValue = maskPhone(value)

    setForm(prev => ({
      ...prev,
      [name]: name === 'num_people' ? parseInt(value) : formattedValue,
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          
          {/* Left: Image & Trip Summary */}
          <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
            <img src={trip.image_url} alt={trip.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold mb-2">Você está reservando:</p>
              <h2 className="font-display text-3xl font-bold text-white mb-4">{trip.name}</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/70 font-mono text-[10px] uppercase tracking-widest">
                  <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center border border-white/10">
                    <CheckCircle size={12} className="text-[#c98228]" />
                  </div>
                  <span>{new Date(trip.departure_date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 font-mono text-[10px] uppercase tracking-widest">
                  <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center border border-white/10">
                    <CheckCircle size={12} className="text-[#c98228]" />
                  </div>
                  <span>{trip.duration_days} dias de expedição</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/40">Valor individual</p>
                  <p className="font-display text-xl font-bold text-white">{formatPrice(trip.price)}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-[#c98228]">Total Estimado</p>
                  <p className="font-display text-2xl font-bold text-[#c98228]">{formatPrice(totalPrice)}</p>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="absolute top-6 left-6 w-8 h-8 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 md:hidden">
              <X size={16} />
            </button>
          </div>

          {/* Right: Form */}
          <div className="md:w-3/5 p-10 md:p-12 overflow-y-auto bg-white">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-display text-2xl font-bold text-night">Finalizar Solicitação</h3>
                <p className="font-body text-night/40 text-xs mt-1">Preencha seus dados para garantir sua vaga.</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-black/5 text-night/40 rounded-full flex items-center justify-center hover:bg-black/10 transition-all hidden md:flex">
                <X size={20} />
              </button>
            </div>

            {step === 'form' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold block mb-2">Nome Completo</label>
                    <input type="text" name="client_name" value={form.client_name} onChange={handleChange} placeholder="Como devemos te chamar?" className="input-field rounded-2xl bg-sand-50/30 border-sand-100 focus:border-[#c98228] focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold block mb-2">E-mail</label>
                    <input type="email" name="client_email" value={form.client_email} onChange={handleChange} placeholder="seu@email.com" className="input-field rounded-2xl bg-sand-50/30 border-sand-100 focus:border-[#c98228] focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold block mb-2">Telefone (WhatsApp)</label>
                    <input type="tel" name="client_phone" value={form.client_phone} onChange={handleChange} placeholder="(63) 99999-9999" className="input-field rounded-2xl bg-sand-50/30 border-sand-100 focus:border-[#c98228] focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold block mb-2">CPF</label>
                    <input type="text" name="client_cpf" value={form.client_cpf} onChange={handleChange} placeholder="000.000.000-00" className="input-field rounded-2xl bg-sand-50/30 border-sand-100 focus:border-[#c98228] focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold block mb-2">Viajantes</label>
                    <select name="num_people" value={form.num_people} onChange={handleChange} className="input-field rounded-2xl bg-sand-50/30 border-sand-100 focus:border-[#c98228] focus:bg-white transition-all cursor-pointer">
                      {Array.from({ length: Math.min(trip.available_spots, 10) }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} pessoa{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] font-bold block mb-2">Observações</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Alguma restrição ou pedido especial?" rows={3} className="input-field rounded-2xl bg-sand-50/30 border-sand-100 focus:border-[#c98228] focus:bg-white transition-all resize-none" />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
                    <AlertCircle size={18} />
                    <span className="font-body text-xs font-bold">{errorMsg}</span>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={loading} className="w-full py-5 btn-primary rounded-[2rem] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-[#c98228]/20 transition-all active:scale-95">
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Processando Solicitação...</>
                  ) : (
                    <>Confirmar Minha Reserva <CheckCircle size={18} /></>
                  )}
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                  <CheckCircle size={48} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-4xl font-bold text-night mb-4">Sucesso!</h3>
                <p className="font-body text-night/50 text-base leading-relaxed max-w-sm mb-10">
                  Sua solicitação para <strong className="text-night font-bold">{trip.name}</strong> foi enviada.
                  Nossa equipe entrará em contato via WhatsApp em poucos minutos.
                </p>
                <button onClick={onClose} className="btn-primary px-12 py-5 rounded-full text-xs uppercase tracking-widest">
                  Voltar para o site
                </button>
              </div>
            )}

            {step === 'error' && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6">
                  <AlertCircle size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold text-night mb-2">Ops! Ocorreu um erro</h3>
                <p className="font-body text-night/50 text-sm mb-8">{errorMsg}</p>
                <button onClick={() => setStep('form')} className="btn-primary px-10 py-4 rounded-full text-xs uppercase tracking-widest">
                  Tentar Novamente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
