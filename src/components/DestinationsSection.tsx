import { useState } from 'react'
import { MapPin, Star } from 'lucide-react'

const destinations = [
  {
    name: 'Dunas do Jalapão',
    description:
      'Formações de areia branca que chegam a 40 metros de altura, criando paisagens de outro mundo no coração do cerrado.',
    tag: 'Ícone do Jalapão',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    rating: 5,
  },
  {
    name: 'Fervedouros',
    description:
      'Nascentes de pressão onde a água borbulha formando piscinas naturais.',
    tag: 'Fenômeno Natural',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    rating: 5,
  },
  {
    name: 'Cachoeira da Velha',
    description:
      'Uma das maiores quedas d\'água do Brasil, com mais de 1,5 km de extensão.',
    tag: 'Majestosa',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80',
    rating: 5,
  },
  {
    name: 'Serra do Espírito Santo',
    description:
      'Formação rochosa que os indígenas consideram sagrada com vistas ao pôr do sol.',
    tag: 'Sagrado & Místico',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    rating: 4,
  },
  {
    name: 'Rio Novo',
    description:
      'Águas cristalinas que revelam o fundo de areia branca e pedras coloridas.',
    tag: 'Águas Cristalinas',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    rating: 5,
  },
  {
    name: 'Capim Dourado',
    description:
      'O ouro do cerrado. Artesanato único produzido pelas comunidades quilombolas de Mumbuca, patrimônio cultural do Brasil.',
    tag: 'Cultura Viva',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    rating: 4,
  },
]

export function DestinationsSection() {
  const [hovered, setHovered] = useState<number | null>(null)

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

        {/* Destinations Grid: Custom Bento Proportions (5-col) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {destinations.map((dest, i) => (
            <div
              key={dest.name}
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
                  backgroundImage: `url('${dest.image}')`,
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
      </div>
    </section>
  )
}
