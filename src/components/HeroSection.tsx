import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 20
      const y = (clientY / innerHeight - 0.5) * 20
      videoRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        <div
          ref={videoRef}
          className="absolute inset-[-5%] transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1800&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0f0e0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #c98228 1px, transparent 1px),
            linear-gradient(to bottom, #c98228 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <p className="section-label animate-fade-up opacity-0 animate-delay-100">
            ✦ Agência de Turismo Tocantins
          </p>

          <h1 className="display-heading text-white text-6xl md:text-8xl font-black mb-6 
                         animate-fade-up opacity-0 animate-delay-200">
            O{' '}
            <em className="text-gradient not-italic">Jalapão</em>
            <br />
            te espera.
          </h1>

          <p className="font-body text-white/60 text-lg md:text-xl leading-relaxed mb-10
                        animate-fade-up opacity-0 animate-delay-300 max-w-xl">
            Dunas douradas, fervedouros cristalinos e um cerrado intocado.
            Experiências únicas no coração selvagem do Brasil.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0 animate-delay-400">
            <button
              onClick={() => document.getElementById('viagens')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Ver Viagens Disponíveis
            </button>
            <button
              onClick={() => document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-white/30 text-white hover:bg-white hover:text-black
                         font-bold px-8 py-4 rounded-none transition-all duration-300 
                         uppercase tracking-widest text-sm"
            >
              Explorar Destinos
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-20 right-6 hidden lg:flex flex-col gap-6">
          {[
            { value: '+500', label: 'Aventureiros' },
            { value: '8 anos', label: 'de Experiência' },
            { value: '100%', label: 'Satisfação' },
          ].map(({ value, label }) => (
            <div key={label} className="text-right animate-fade-up opacity-0 animate-delay-500">
              <div className="font-display text-2xl font-bold text-gradient">{value}</div>
              <div className="font-body text-white/40 text-xs uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 
                      animate-bounce flex flex-col items-center gap-2">
        <span className="font-mono text-white/30 text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} className="text-[#c98228]" />
      </div>
    </section>
  )
}
