import { Shield, Award, Heart, Leaf } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Segurança Primeiro',
    description: 'Todos os nossos guias são certificados e nossas expedições seguem protocolos rigorosos de segurança.',
  },
  {
    icon: Leaf,
    title: 'Turismo Sustentável',
    description: 'Trabalhamos com comunidades locais e adotamos práticas de baixo impacto para preservar o Jalapão.',
  },
  {
    icon: Award,
    title: 'Experiência Comprovada',
    description: 'Mais de 8 anos explorando o Jalapão. Conhecemos cada trilha, cada fervedouro, cada segredo deste paraíso.',
  },
  {
    icon: Heart,
    title: 'Paixão pelo Cerrado',
    description: 'Somos tocantinenses apaixonados pela nossa terra. Cada viagem é uma forma de compartilhar esse amor.',
  },
]

const team = [
  { name: 'Rafael Moreira', role: 'Guia Chefe & Fundador', years: '8 anos de Jalapão' },
  { name: 'Ana Clara Souza', role: 'Guia Especialista', years: '5 anos de expedições' },
  { name: 'Marcos Tupinambá', role: 'Guia Cultural & Fotógrafo', years: 'Nativo de Mateiros' },
]

export function AboutSection() {
  return (
    <section id="sobre" className="py-32 px-6 bg-[#0f0e0a] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c98228]/40 to-transparent" />

      {/* Background decoration */}
      <div className="absolute right-0 top-1/4 w-96 h-96 rounded-full 
                      bg-[#c98228]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Main about */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          <div>
            <p className="section-label">✦ Nossa História</p>
            <h2 className="display-heading text-5xl md:text-6xl font-black mb-8">
              Nativos do<br />
              <span className="text-gradient">Tocantins</span>
            </h2>
            <div className="space-y-4 font-body text-white/50 leading-relaxed">
              <p>
                A <strong className="text-white">Jalapão Selvagem</strong> nasceu do amor de um grupo de
                aventureiros tocantinenses pelo seu próprio estado. Fundada em 2016, nossa missão sempre
                foi uma só: mostrar ao Brasil e ao mundo as maravilhas do Jalapão de forma autêntica,
                segura e sustentável.
              </p>
              <p>
                Somos guiados por princípios simples: respeitar a natureza, valorizar as comunidades
                locais e criar experiências que transformam. Cada expedição é cuidadosamente planejada
                para que você volte para casa com memórias inesquecíveis — e uma vontade irresistível
                de voltar.
              </p>
              <p>
                Com mais de 500 aventureiros guiados e nenhum incidente grave em 8 anos de operação,
                temos orgulho de ser a agência mais respeitada do estado para expedições ao Jalapão.
              </p>
            </div>
          </div>

          {/* Image collage */}
          <div className="relative h-96 lg:h-auto">
            <div
              className="absolute inset-0 lg:inset-4"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=700&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border-4 border-[#0f0e0a]"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=300&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute -top-4 -right-4 font-mono text-xs text-right p-4 
                            bg-[#c98228] text-[#0f0e0a]">
              <div className="text-3xl font-black font-display">8</div>
              <div className="uppercase tracking-widest text-[10px]">Anos de</div>
              <div className="uppercase tracking-widest text-[10px]">Experiência</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <p className="section-label text-center mb-4">✦ Nossos Valores</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title}
                className="bg-[#0f0e0a] p-8 group hover:bg-[#1a1710] transition-colors duration-300">
                <div className="w-10 h-10 border border-[#c98228]/40 flex items-center justify-center 
                                mb-6 group-hover:border-[#c98228] group-hover:bg-[#c98228]/10 
                                transition-all duration-300">
                  <Icon size={18} className="text-[#c98228]" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-3">{title}</h3>
                <p className="font-body text-white/40 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <p className="section-label text-center mb-4">✦ Nossa Equipe</p>
          <h3 className="display-heading text-3xl font-black text-center mb-12">
            Guias que <span className="text-gradient">conhecem tudo</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.name}
                className="border border-white/10 p-6 hover:border-[#c98228]/40 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#c98228] to-[#e8c070] mb-4
                                flex items-center justify-center font-display text-2xl font-black text-[#0f0e0a]">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h4 className="font-display font-bold text-white text-lg">{member.name}</h4>
                <p className="font-body text-[#c98228] text-sm mb-1">{member.role}</p>
                <p className="font-mono text-white/30 text-xs uppercase tracking-widest">{member.years}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
