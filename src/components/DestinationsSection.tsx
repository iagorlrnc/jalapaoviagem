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
      setDestinations(data)
      setLoading(false)
    })
  }, [])

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {destinations.map((dest, i) => (
              <div
                key={dest.id}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative overflow-hidden bg-white cursor-pointer group rounded-[2.5rem] 
                           transition-all duration-500 shadow-sm hover:shadow-xl
                           ${i === 0 ? 'md:row-span-2 md:col-span-3 aspect-[4/5] md:aspect-auto' : 
                             i === 5 ? 'md:col-span-5 aspect-[2/1] md:aspect-[6/1]' : 
                             'col-span-1 aspect-square'}`}
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
