import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Compass } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0f0e0a]/95 backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-[#c98228] flex items-center justify-center 
                          group-hover:bg-[#c98228] transition-colors duration-300">
            <Compass size={16} className="text-[#c98228] group-hover:text-[#0f0e0a] transition-colors" />
          </div>
          <div className="font-display">
            <span className="text-white text-lg font-semibold tracking-wide">Jalapão</span>
            <span className="text-[#c98228] text-lg font-light ml-1 tracking-wider">Selvagem</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Destinos', id: 'destinos' },
            { label: 'Viagens', id: 'viagens' },
            { label: 'Sobre', id: 'sobre' },
            { label: 'Contato', id: 'contato' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-white/70 hover:text-[#e8c070] font-body text-sm uppercase 
                         tracking-[0.15em] transition-colors duration-200"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('viagens')}
            className="btn-primary text-xs px-6 py-3"
          >
            Reservar Agora
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white/80 hover:text-[#c98228] transition-colors"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f0e0a]/98 backdrop-blur-md border-t border-white/10 
                        px-6 py-8 flex flex-col gap-6">
          {[
            { label: 'Destinos', id: 'destinos' },
            { label: 'Viagens', id: 'viagens' },
            { label: 'Sobre', id: 'sobre' },
            { label: 'Contato', id: 'contato' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-white/70 text-left font-body uppercase tracking-[0.2em] 
                         text-sm hover:text-[#e8c070] transition-colors"
            >
              {label}
            </button>
          ))}
          <button onClick={() => scrollTo('viagens')} className="btn-primary mt-2 text-xs">
            Reservar Agora
          </button>
        </div>
      )}
    </nav>
  )
}
