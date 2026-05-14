import { MessageCircle } from 'lucide-react'

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/556399999999?text=Olá! Gostaria de saber mais sobre as expedições para o Jalapão."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[90] bg-emerald-500 text-white p-4 rounded-full shadow-2xl 
                 hover:bg-emerald-600 transition-all duration-300 hover:scale-110 group"
      aria-label="Falar no WhatsApp"
    >
      <div className="absolute -top-12 right-0 bg-white text-black px-3 py-1 rounded-md text-[10px] 
                      font-bold uppercase tracking-widest whitespace-nowrap opacity-0 
                      group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
        Dúvidas? Chame aqui!
        <div className="absolute top-full right-4 border-8 border-transparent border-t-white" />
      </div>
      <MessageCircle size={24} />
    </a>
  )
}
