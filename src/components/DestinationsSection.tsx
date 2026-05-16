import { useEffect, useState } from 'react'
import { MapPin, Star, Loader2 } from 'lucide-react'
import { getDestinations } from '../lib/api'
import { Destination } from '../lib/supabase'

export function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [hovered, setHovered] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDestinations().then(data => {
      setDestinations(data.slice(0, 7))
      setLoading(false)
    })
  }, [])

  const getLayoutClasses = (index: number, total: number) => {
    const base = "relative overflow-hidden bg-white cursor-pointer group rounded-[2.5rem] transition-all duration-500 shadow-sm hover:shadow-xl w-full h-full"

    // Edge case: Only 1 item
    if (total === 1) {
      return `${base} col-span-1 md:col-span-12 aspect-video`
    }

    // Logic for 2 items: Side by side, same size
    if (total === 2) {
      return `${base} col-span-1 md:col-span-6 aspect-[4/5] md:aspect-square`
    }

    // Index 0: Hero (Top Left) for 3+ items
    if (index === 0) {
      return `${base} col-span-1 md:col-span-6 md:row-span-2 aspect-[4/5] md:aspect-[3/4]`
    }

    if (total === 3) {
      // 1 Hero (6x2) + 2 Stacked on right (6x1 each)
      return `${base} col-span-1 md:col-span-6 md:row-span-1 aspect-video`
    }

    if (total === 4) {
      // 1 Hero + 2 small top-right + 1 wide bottom-right
      if (index === 1 || index === 2) return `${base} col-span-1 md:col-span-3 aspect-square`
      return `${base} col-span-1 md:col-span-6 aspect-video`
    }

    if (total <= 6) {
      // 1 Hero + 4 small (2x2) + 1 full-width bottom
      if (index >= 1 && index <= 4) return `${base} col-span-1 md:col-span-3 aspect-square`
      return `${base} col-span-1 md:col-span-12 aspect-[3/1] md:aspect-[6/1]`
    }

    if (total <= 8) {
      // 1 Hero + 4 small (2x2) + 2 half-width bottom
      if (index >= 1 && index <= 4) return `${base} col-span-1 md:col-span-3 aspect-square`
      if (index >= 5) return `${base} col-span-1 md:col-span-6 aspect-video`
    }

    // Layout for 10+ items: 1 Hero + 6 small (2x3 grid) + 3 bottom items (1/3 width each)
    if (index >= 1 && index <= 6) return `${base} col-span-1 md:col-span-3 aspect-square`
    return `${base} col-span-1 md:col-span-4 aspect-square md:aspect-video`
  }

  return (
    <section id="destinos" className="py-32 px-6 bg-white relative">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c98228]/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <p className="section-label">✦ Destinos Imperdíveis</p>
            <h2 className="display-heading text-5xl md:text-6xl font-black">
              O melhor do<br />
              <span className="text-gradient">Jalapão</span>
            </h2>
          </div>
          <p className="font-body text-night/50 max-w-sm text-sm leading-relaxed">
            Cada destino é uma experiência única. Nossa equipe conhece cada trilha,
            cada fervedouro e cada pôr do sol perfeito.
          </p>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-night/40">
            <Loader2 size={24} className="animate-spin text-[#c98228]" />
            <span className="font-body">Sincronizando destinos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-fr">
            {destinations.map((dest, i) => (
              <div
                key={dest.id}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={getLayoutClasses(i, destinations.length)}
              >
                {/* Image */}
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${dest.image_url}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                                group-hover:via-black/40 transition-all duration-500" />

                {/* Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-mono text-[10px] uppercase tracking-widest
                                   bg-[#c98228] text-[#0f0e0a] px-2 py-1 font-bold">
                    {dest.tag}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 z-10 flex gap-0.5">
                  {Array.from({ length: dest.rating }).map((_, j) => (
                    <Star key={j} size={10} className="fill-[#c98228] text-[#c98228]" />
                  ))}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={12} className="text-[#c98228]" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#c98228]">
                      Jalapão, TO
                    </span>
                  </div>
                  <h3 className="font-display text-white text-xl font-bold mb-2">
                    {dest.name}
                  </h3>
                  <p
                    className={`font-body text-white/60 text-sm leading-relaxed transition-all duration-500
                      ${hovered === i ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                  >
                    {dest.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
