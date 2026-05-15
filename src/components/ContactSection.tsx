import { useEffect, useState } from 'react'
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, Compass, Loader2, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSettings, sendMessage } from '../lib/api'
import { SiteSettings } from '../lib/supabase'

export function ContactSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(data => {
      setSettings(data)
      setLoading(false)
    })
  }, [])

  const contactItems = [
    {
      icon: Phone,
      label: 'WhatsApp',
      value: settings?.whatsapp ? `(63) ${settings.whatsapp.slice(-9, -4)}-${settings.whatsapp.slice(-4)}` : 'Não informado',
      href: settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : '#',
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: settings?.email || 'Não informado',
      href: settings?.email ? `mailto:${settings.email}` : '#',
    },
    {
      icon: MapPin,
      label: 'Localização',
      value: settings?.address || 'Não informado',
      href: settings?.maps_url || '',
    },
    {
      icon: Clock,
      label: 'Atendimento',
      value: settings?.working_hours || 'Não informado',
      href: '',
    },
  ]

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value)
    setForm({ ...form, phone: masked })
  }

  const [loadingMsg, setLoadingMsg] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert('Por favor, preencha os campos obrigatórios (Nome, E-mail e Mensagem).')
      return
    }

    setLoadingMsg(true)
    const result = await sendMessage({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject || 'Sem assunto',
      message: form.message
    })

    setLoadingMsg(false)
    if (result.success) {
      setSent(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 5000)
    } else {
      alert('Erro ao enviar mensagem. Tente novamente.')
    }
  }

  return (
    <section id="contato" className="py-32 px-6 bg-dusk relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c98228]/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left */}
          <div>
            <p className="section-label">✦ Fale Conosco</p>
            <h2 className="display-heading text-5xl md:text-6xl font-black mb-8">
              Pronto para a<br />
              <span className="text-gradient">aventura?</span>
            </h2>
            <p className="font-body text-night/50 leading-relaxed mb-10">
              Entre em contato com nossa equipe. Respondemos em até 2 horas 
              no horário comercial. Para urgências, use nosso WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full py-10 flex items-center justify-center gap-3 text-night/20">
                  <Loader2 size={20} className="animate-spin text-[#c98228]" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Sincronizando...</span>
                </div>
              ) : (
                contactItems.map(({ icon: Icon, label, value, href }) => {
                  const Tag = href ? 'a' : 'div'
                  return (
                    <Tag
                      key={label}
                      href={href || undefined}
                      className={`p-8 bg-black/5 backdrop-blur-xl border border-white/20 rounded-[3.5rem] group 
                                 transition-all duration-500 shadow-2xl flex flex-col items-center text-center
                                 hover:bg-black/20 hover:scale-[1.02] ${href ? 'cursor-pointer' : 'cursor-default'}`}
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                    >
                      <div className="w-12 h-12 bg-white flex items-center justify-center mb-4 rounded-2xl shadow-sm">
                        <Icon size={18} className="text-[#c98228]" />
                      </div>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-night/30 mb-1">
                          {label}
                        </p>
                        <p className="font-body text-xs text-night/70 group-hover:text-night transition-colors font-bold break-all">
                          {value}
                        </p>
                      </div>
                    </Tag>
                  )
                })
              )}
            </div>

            {/* Social */}
            {!loading && (
              <div className="flex gap-4 mt-10">
                {[
                  { icon: Instagram, href: settings?.instagram_url || '#', label: 'Instagram' },
                  { icon: Facebook, href: settings?.facebook_url || '#', label: 'Facebook' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white border border-black/5 rounded-full flex items-center justify-center
                               text-night/40 hover:text-white hover:bg-[#c98228] hover:border-[#c98228]
                               transition-all duration-500 shadow-sm"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right: Quick contact form */}
          <div className="bg-black/5 backdrop-blur-xl border border-white/20 p-10 rounded-[3.5rem] shadow-2xl relative z-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] mb-8 font-bold text-center">
              ✦ Envie uma Mensagem
            </p>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field bg-white/50"
                />
                <input
                  type="tel"
                  placeholder="Whatsapp"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  className="input-field bg-white/50"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field sm:col-span-2 bg-white/50"
                />
              </div>
              <select 
                className="input-field bg-white/50"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              >
                <option value="">Assunto da mensagem</option>
                <option>Informações sobre viagens</option>
                <option>Orçamento personalizado</option>
                <option>Parceria comercial</option>
                <option>Outros</option>
              </select>
              <textarea
                rows={5}
                placeholder="Sua mensagem..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="input-field resize-none bg-white/50"
              />
              <button 
                onClick={handleSubmit}
                disabled={loadingMsg || sent}
                className={`btn-primary w-full py-5 text-sm flex items-center justify-center gap-2 transition-all ${sent ? 'bg-emerald-600' : ''}`}
              >
                {loadingMsg ? (
                  <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                ) : sent ? (
                  <><CheckCircle size={16} /> Mensagem Enviada!</>
                ) : (
                  'Enviar Mensagem'
                )}
              </button>
              <p className="font-mono text-[9px] text-night text-center uppercase tracking-widest">
                Dúvidas urgentes? Use nosso canal de WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  return (
    <footer className="bg-white border-t border-black/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#c98228] flex items-center justify-center">
              <Compass size={14} className="text-[#c98228]" />
            </div>
            <div className="font-display">
              <span className="text-night font-semibold">Jalapão</span>
              <span className="text-[#c98228] font-light ml-1">Selvagem</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {['Destinos', 'Viagens', 'Sobre', 'Contato'].map(item => (
              <button
                key={item}
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="font-body text-night hover:text-[#c98228] text-xs uppercase 
                           tracking-widest transition-colors font-bold"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Admin link */}
          <Link
            to="/admin/login"
            className="font-mono text-[10px] text-night/60 hover:text-[#c98228] 
                       uppercase tracking-widest transition-colors font-bold"
          >
            Área Admin
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-black/5 flex flex-col md:flex-row 
                        justify-between gap-2 text-center md:text-left">
          <p className="font-mono text-[10px] text-night font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Jalapão Selvagem Turismo. Todos os direitos reservados.
          </p>
          <p className="font-mono text-[10px] text-night font-bold uppercase tracking-widest">
            {settings?.address || 'Palmas, Tocantins — Brasil'}
          </p>
        </div>
      </div>
    </footer>
  )
}
