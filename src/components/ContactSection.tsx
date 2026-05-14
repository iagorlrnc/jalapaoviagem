import { MapPin, Phone, Mail, Instagram, Facebook, Clock, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ContactSection() {
  return (
    <section id="contato" className="py-32 px-6 bg-[#0d0c09] relative">
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
            <p className="font-body text-white/50 leading-relaxed mb-10">
              Entre em contato com nossa equipe. Respondemos em até 2 horas 
              no horário comercial. Para urgências, use nosso WhatsApp.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  label: 'WhatsApp / Telefone',
                  value: '(63) 9 9999-9999',
                  href: 'https://wa.me/556399999999',
                },
                {
                  icon: Mail,
                  label: 'E-mail',
                  value: 'contato@jalpaoselvagem.com.br',
                  href: 'mailto:contato@jalpaoselvagem.com.br',
                },
                {
                  icon: MapPin,
                  label: 'Endereço',
                  value: 'Palmas, Tocantins — Brasil',
                  href: '#',
                },
                {
                  icon: Clock,
                  label: 'Horário de Atendimento',
                  value: 'Seg–Sex: 8h–18h | Sáb: 8h–12h',
                  href: '#',
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-start gap-4 group"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  <div className="w-10 h-10 border border-[#c98228]/30 flex items-center justify-center
                                  flex-shrink-0 group-hover:border-[#c98228] group-hover:bg-[#c98228]/10 
                                  transition-all duration-300 mt-0.5">
                    <Icon size={16} className="text-[#c98228]" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-0.5">
                      {label}
                    </p>
                    <p className="font-body text-white/70 group-hover:text-white transition-colors">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-10">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center
                             text-white/40 hover:border-[#c98228] hover:text-[#c98228] 
                             transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Quick contact form */}
          <div className="border border-white/10 p-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] mb-6">
              Envie uma Mensagem
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Seu nome"
                className="input-field"
              />
              <input
                type="email"
                placeholder="Seu e-mail"
                className="input-field"
              />
              <select className="input-field">
                <option value="">Assunto da mensagem</option>
                <option>Informações sobre viagens</option>
                <option>Orçamento personalizado</option>
                <option>Parceria comercial</option>
                <option>Outros</option>
              </select>
              <textarea
                rows={5}
                placeholder="Sua mensagem..."
                className="input-field resize-none"
              />
              <button className="btn-primary w-full">
                Enviar Mensagem
              </button>
              <p className="font-mono text-[10px] text-white/20 text-center tracking-widest">
                Para reservas, use o botão "Reservar" nas viagens acima.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#080807] border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#c98228] flex items-center justify-center">
              <Compass size={14} className="text-[#c98228]" />
            </div>
            <div className="font-display">
              <span className="text-white font-semibold">Jalapão</span>
              <span className="text-[#c98228] font-light ml-1">Selvagem</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {['Destinos', 'Viagens', 'Sobre', 'Contato'].map(item => (
              <button
                key={item}
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="font-body text-white/30 hover:text-white/60 text-xs uppercase 
                           tracking-widest transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Admin link */}
          <Link
            to="/admin/login"
            className="font-mono text-[10px] text-white/20 hover:text-white/40 
                       uppercase tracking-widest transition-colors"
          >
            Área Admin
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row 
                        justify-between gap-2 text-center md:text-left">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            © 2024 Jalapão Selvagem Turismo. Todos os direitos reservados.
          </p>
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            Palmas, Tocantins — Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
