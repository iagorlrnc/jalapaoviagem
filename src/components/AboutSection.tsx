import { useEffect, useState } from "react"
import { Shield, Award, Heart, Leaf, Loader2 } from "lucide-react"
import { getTeamMembers } from "../lib/api"
import { TeamMember } from "../lib/supabase"
import about1 from "../public/images/about1.webp"
import about2 from "../public/images/about2.jpg"

const values = [
  {
    icon: Shield,
    title: "Segurança Primeiro",
    description:
      "Todos os nossos guias são certificados e nossas expedições seguem protocolos rigorosos de segurança.",
  },
  {
    icon: Leaf,
    title: "Turismo Sustentável",
    description:
      "Trabalhamos com comunidades locais e adotamos práticas de baixo impacto para preservar o Jalapão.",
  },
  {
    icon: Award,
    title: "Experiência Comprovada",
    description:
      "Mais de 8 anos explorando o Jalapão. Conhecemos cada trilha, cada fervedouro, cada segredo deste paraíso.",
  },
  {
    icon: Heart,
    title: "Paixão pelo Cerrado",
    description:
      "Somos tocantinenses apaixonados pela nossa terra. Cada viagem é uma forma de compartilhar esse amor.",
  },
]

export function AboutSection() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTeamMembers().then((data) => {
      setTeam(data)
      setLoading(false)
    })
  }, [])
  return (
    <section
      id="sobre"
      className="py-32 px-6 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c98228]/40 to-transparent" />

      {/* Background decoration */}
      <div
        className="absolute right-0 top-1/4 w-96 h-96 rounded-full 
                      bg-[#c98228]/5 blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto">
        {/* Main about */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          <div>
            <p className="section-label">✦ Nossa História</p>
            <h2 className="display-heading text-5xl md:text-6xl font-black mb-8">
              Nativos do
              <br />
              <span className="text-gradient">Tocantins</span>
            </h2>
            <div className="space-y-4 font-body text-night/50 leading-relaxed">
              <p>
                A <strong className="text-night">Jalapão Selvagem</strong>{" "}
                nasceu do amor de um grupo de aventureiros tocantinenses pelo
                seu próprio estado. Fundada em 2016, nossa missão sempre foi uma
                só: mostrar ao Brasil e ao mundo as maravilhas do Jalapão de
                forma autêntica, segura e sustentável.
              </p>
              <p>
                Somos guiados por princípios simples: respeitar a natureza,
                valorizar as comunidades locais e criar experiências que
                transformam. Cada expedição é cuidadosamente planejada para que
                você volte para casa com memórias inesquecíveis — e uma vontade
                irresistível de voltar.
              </p>
              <p>
                Com mais de 500 aventureiros guiados e nenhum incidente grave em
                8 anos de operação, temos orgulho de ser a agência mais
                respeitada do estado para expedições ao Jalapão.
              </p>
            </div>
          </div>

          {/* Image collage */}
          <div className="relative h-96 lg:h-auto">
            <div
              className="absolute inset-0 lg:inset-4 rounded-[3rem] overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url(${about1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-48 h-48 border-[6px] border-white rounded-[2rem] overflow-hidden shadow-xl"
              style={{
                backgroundImage: `url(${about2})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute -top-4 -right-4 font-mono text-xs text-center p-6 
                            bg-[#c98228] text-white rounded-[2rem] shadow-xl flex flex-col items-center justify-center min-w-[120px]"
            >
              <div className="text-4xl font-black font-display mb-1">8</div>
              <div className="uppercase tracking-widest text-[8px] font-bold opacity-80 leading-tight">
                Anos de
              </div>
              <div className="uppercase tracking-widest text-[8px] font-bold opacity-80 leading-tight">
                Experiência
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <p className="section-label text-center mb-4">✦ Nossos Valores</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white p-8 rounded-[2rem] border border-black/5 
                           hover:border-[#c98228]/30 hover:shadow-xl transition-all duration-500 group"
              >
                <div
                  className="w-12 h-12 bg-[#c98228]/5 rounded-2xl flex items-center justify-center 
                                mb-6 group-hover:bg-[#c98228] transition-all duration-500 shadow-sm"
                >
                  <Icon
                    size={20}
                    className="text-[#c98228] group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-display font-bold text-night text-xl mb-3">
                  {title}
                </h3>
                <p className="font-body text-night/50 text-sm leading-relaxed">
                  {description}
                </p>
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
            {loading ? (
              <div className="col-span-3 flex items-center justify-center py-10 gap-3 text-night/40">
                <Loader2 size={24} className="animate-spin text-[#c98228]" />
                <span className="font-body">Sincronizando equipe...</span>
              </div>
            ) : (
              team.map((member) => (
                <div
                  key={member.id}
                  className="bg-black/5 backdrop-blur-xl border border-white/20 p-8 rounded-[3.5rem] 
                             hover:bg-black/20 hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 group
                             flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-[2.5rem] overflow-hidden group-hover:rotate-6 transition-transform duration-500 shadow-lg relative">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#c98228] to-[#e8c070] flex items-center justify-center font-display text-2xl font-black text-white">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-display font-bold text-night text-xl mb-1">
                    {member.name}
                  </h4>
                  <p className="font-body text-[#c98228] text-sm mb-4 font-semibold">
                    {member.role}
                  </p>
                  <div className="pt-4 border-t border-black/5">
                    <p className="font-mono text-night/30 text-[10px] uppercase tracking-widest">
                      {member.years_experience}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
