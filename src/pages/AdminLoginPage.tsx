import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Compass, AlertCircle } from 'lucide-react'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!password) return
    setLoading(true)
    setError('')

    await new Promise(r => setTimeout(r, 600)) // Simulate auth delay

    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'jalapao2024'
    if (password === adminPass) {
      sessionStorage.setItem('admin_authenticated', 'true')
      navigate('/admin')
    } else {
      setError('Senha incorreta. Tente novamente.')
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen bg-[#0f0e0a] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=60')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0e0a] via-[#0f0e0a]/90 to-[#0f0e0a]" />

      {/* Grid decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #c98228 1px, transparent 1px),
            linear-gradient(to bottom, #c98228 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 border border-[#c98228] flex items-center justify-center">
            <Compass size={20} className="text-[#c98228]" />
          </div>
          <div className="font-display text-center">
            <div>
              <span className="text-white text-xl font-semibold">Jalapão</span>
              <span className="text-[#c98228] text-xl font-light ml-1">Selvagem</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mt-0.5">
              Painel Administrativo
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="border border-white/10 bg-[#0f0e0a]/80 backdrop-blur-sm p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228] mb-6">
            Acesso Restrito
          </p>

          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                Senha de Administrador
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••••"
                  className="input-field pr-12"
                  autoFocus
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 
                             hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 
                              border border-red-500/30 p-3">
                <AlertCircle size={14} />
                <span className="font-body text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className={`w-full py-4 font-bold uppercase tracking-widest text-xs
                          transition-all duration-300
                          ${loading || !password
                            ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                            : 'btn-primary'
                          }`}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="font-mono text-[10px] text-white/20 text-center uppercase tracking-widest">
              Apenas administradores autorizados
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="font-mono text-[10px] text-white/30 hover:text-white/50 
                       uppercase tracking-widest transition-colors"
          >
            ← Voltar ao Site
          </button>
        </div>
      </div>
    </div>
  )
}
