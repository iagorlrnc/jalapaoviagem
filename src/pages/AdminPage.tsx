import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass, LogOut, Users, DollarSign, Calendar, TrendingUp,
  Search, ChevronDown, Trash2, CheckCircle, XCircle, Clock,
  RefreshCw, Eye, MessageCircle, Copy, Loader2
} from 'lucide-react'
import { Reservation } from '../lib/supabase'
import { getAllReservations, updateReservationStatus, deleteReservation } from '../lib/api'

type StatusFilter = 'todos' | 'pendente' | 'confirmada' | 'cancelada'

const statusConfig = {
  pendente: {
    label: 'Pendente',
    icon: Clock,
    classes: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  },
  confirmada: {
    label: 'Confirmada',
    icon: CheckCircle,
    classes: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  },
  cancelada: {
    label: 'Cancelada',
    icon: XCircle,
    classes: 'text-red-400 bg-red-400/10 border-red-400/30',
  },
}

const formatPrice = (p: number) =>
  p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export function AdminPage() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated')
    if (!isAuth) {
      navigate('/admin/login')
      return
    }
    loadReservations()
  }, [navigate])

  const loadReservations = async () => {
    setLoading(true)
    const data = await getAllReservations()
    setReservations(data)
    setLoading(false)
  }

  const handleStatusChange = async (id: string, status: Reservation['status']) => {
    setUpdatingId(id)
    await updateReservationStatus(id, status)
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    )
    if (selectedReservation?.id === id) {
      setSelectedReservation(prev => prev ? { ...prev, status } : null)
    }
    setUpdatingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta reserva?')) return
    await deleteReservation(id)
    setReservations(prev => prev.filter(r => r.id !== id))
    if (selectedReservation?.id === id) setSelectedReservation(null)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    navigate('/admin/login')
  }

  // Stats
  const totalRevenue = reservations
    .filter(r => r.status === 'confirmada')
    .reduce((sum, r) => sum + r.total_price, 0)
  const pending = reservations.filter(r => r.status === 'pendente').length
  const confirmed = reservations.filter(r => r.status === 'confirmada').length
  const totalPeople = reservations
    .filter(r => r.status !== 'cancelada')
    .reduce((sum, r) => sum + r.num_people, 0)

  // Filtered
  const filtered = reservations.filter(r => {
    const matchStatus = statusFilter === 'todos' || r.status === statusFilter
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || [r.client_name, r.client_email, r.trip_name, r.client_phone]
      .some(v => v.toLowerCase().includes(q))
    return matchStatus && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#0d0c09] flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#0f0e0a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#c98228] flex items-center justify-center">
            <Compass size={15} className="text-[#c98228]" />
          </div>
          <div>
            <span className="font-display text-white font-semibold">Jalapão Selvagem</span>
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest ml-3">
              Painel Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={loadReservations}
            className="text-white/40 hover:text-white/70 transition-colors p-2"
            title="Atualizar"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="font-mono text-[10px] uppercase tracking-widest text-white/30 
                       hover:text-white/60 transition-colors hidden md:block"
          >
            Ver Site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-red-400 
                       transition-colors font-mono text-xs uppercase tracking-widest"
          >
            <LogOut size={14} />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-screen-2xl mx-auto w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: DollarSign, label: 'Receita Confirmada', value: formatPrice(totalRevenue), color: 'text-emerald-400' },
            { icon: Calendar, label: 'Total de Reservas', value: reservations.length.toString(), color: 'text-[#c98228]' },
            { icon: Clock, label: 'Aguardando Confirmação', value: pending.toString(), color: 'text-yellow-400' },
            { icon: Users, label: 'Viajantes (ativos)', value: totalPeople.toString(), color: 'text-sky-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label}
              className="bg-[#0f0e0a] border border-white/10 p-5 hover:border-white/20 
                         transition-colors duration-200">
              <div className="flex items-start justify-between mb-4">
                <Icon size={18} className={color} />
                <TrendingUp size={12} className="text-white/20" />
              </div>
              <div className={`font-display text-2xl font-bold mb-1 ${color}`}>{value}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/30">{label}</div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Table */}
          <div className="flex-1 bg-[#0f0e0a] border border-white/10">
            {/* Table header */}
            <div className="flex flex-col md:flex-row gap-4 p-5 border-b border-white/10">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou viagem..."
                  className="input-field pl-9 text-sm"
                />
              </div>
              <div className="flex gap-2">
                {(['todos', 'pendente', 'confirmada', 'cancelada'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`font-mono text-[10px] uppercase tracking-widest px-3 py-2 
                                border transition-all duration-200 whitespace-nowrap
                                ${statusFilter === s
                                  ? 'bg-[#c98228] text-[#0f0e0a] border-[#c98228] font-bold'
                                  : 'border-white/20 text-white/40 hover:border-white/40'
                                }`}
                  >
                    {s === 'todos' ? 'Todos' : statusConfig[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-24 text-white/40 gap-3">
                  <RefreshCw size={20} className="animate-spin text-[#c98228]" />
                  <span className="font-body">Carregando reservas...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-24 text-white/30 font-body">
                  {reservations.length === 0
                    ? 'Nenhuma reserva encontrada. As reservas feitas no site aparecerão aqui.'
                    : 'Nenhuma reserva encontrada com os filtros selecionados.'}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Cliente', 'Viagem', 'Partida', 'Pessoas', 'Total', 'Status', 'Ações'].map(h => (
                        <th key={h}
                          className="font-mono text-[10px] uppercase tracking-widest text-white/30 
                                     text-left px-4 py-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const sc = statusConfig[r.status]
                      const Icon = sc.icon
                      const isUpdating = updatingId === r.id
                      return (
                        <tr
                          key={r.id}
                          className={`border-b border-white/5 hover:bg-white/3 transition-colors
                                      ${selectedReservation?.id === r.id ? 'bg-white/5' : ''}`}
                        >
                          <td className="px-4 py-4">
                            <div className="font-body text-white text-sm font-medium">
                              {r.client_name}
                            </div>
                            <div className="font-mono text-[10px] text-white/30">{r.client_email}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-body text-white/70 text-sm">{r.trip_name}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-mono text-xs text-white/50">
                              {formatDate(r.departure_date)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="font-mono text-sm text-white/70">{r.num_people}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-display text-sm font-bold text-gradient">
                              {formatPrice(r.total_price)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2 py-1 
                                            border font-mono text-[10px] uppercase tracking-widest
                                            ${sc.classes}`}>
                              <Icon size={10} />
                              {sc.label}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedReservation(r)}
                                className="text-white/30 hover:text-[#c98228] transition-colors p-1"
                                title="Ver detalhes"
                              >
                                <Eye size={14} />
                              </button>
                              <a
                                href={`https://wa.me/55${r.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `Olá ${r.client_name}! Aqui é da Jalapão Selvagem. Recebemos seu interesse na viagem "${r.trip_name}". Podemos conversar sobre os detalhes do pagamento?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/30 hover:text-emerald-400 transition-colors p-1"
                                title="Enviar mensagem"
                              >
                                <MessageCircle size={14} />
                              </a>
                              <div className="relative group">
                                <button
                                  className="text-white/30 hover:text-white/60 transition-colors 
                                             p-1 flex items-center gap-0.5"
                                  disabled={isUpdating}
                                >
                                  <ChevronDown size={14} />
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a12] 
                                                border border-white/20 z-20 hidden group-hover:block shadow-xl">
                                  {(['pendente', 'confirmada', 'cancelada'] as const)
                                    .filter(s => s !== r.status)
                                    .map(s => {
                                      const SC = statusConfig[s]
                                      const SI = SC.icon
                                      return (
                                        <button
                                          key={s}
                                          onClick={() => handleStatusChange(r.id, s)}
                                          disabled={isUpdating}
                                          className={`w-full flex items-center gap-2 px-4 py-3
                                                      font-mono text-[10px] uppercase tracking-widest
                                                      hover:bg-white/5 transition-colors text-left
                                                      ${SC.classes}`}
                                        >
                                          {isUpdating ? <Loader2 size={10} className="animate-spin" /> : <SI size={10} />}
                                          {SC.label}
                                        </button>
                                      )
                                    })}
                                  <div className="border-t border-white/10">
                                    <button
                                      onClick={() => handleDelete(r.id)}
                                      className="w-full flex items-center gap-2 px-4 py-3
                                                 font-mono text-[10px] uppercase tracking-widest
                                                 text-red-400 hover:bg-red-900/20 transition-colors text-left"
                                    >
                                      <Trash2 size={10} />
                                      Excluir
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Table footer */}
            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-white/5 flex justify-between">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  {filtered.length} reserva{filtered.length !== 1 ? 's' : ''} exibida{filtered.length !== 1 ? 's' : ''}
                </span>
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  Total: {formatPrice(filtered.reduce((s, r) => s + r.total_price, 0))}
                </span>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selectedReservation && (
            <div className="w-full lg:w-80 bg-[#0f0e0a] border border-white/10 p-6 self-start">
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#c98228]">
                  Detalhes
                </p>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5">
                {/* Status */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-2">
                    Status
                  </p>
                  <div className={`inline-flex items-center gap-2 px-3 py-2 border
                                   font-mono text-xs uppercase tracking-widest
                                   ${statusConfig[selectedReservation.status].classes}`}>
                    {(() => {
                      const SI = statusConfig[selectedReservation.status].icon
                      return <SI size={12} />
                    })()}
                    {statusConfig[selectedReservation.status].label}
                  </div>
                </div>

                {/* Client */}
                <div className="space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                    Cliente
                  </p>
                  {[
                    { label: 'Nome', value: selectedReservation.client_name },
                    { label: 'E-mail', value: selectedReservation.client_email },
                    { label: 'Telefone', value: selectedReservation.client_phone },
                    { label: 'CPF', value: selectedReservation.client_cpf },
                  ].map(({ label, value }) => (
                      <div className="flex items-center justify-between group/copy">
                        <div>
                          <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                            {label}
                          </span>
                          <div className="font-body text-white/70 text-sm mt-0.5">{value}</div>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(value)
                            alert(`${label} copiado!`)
                          }}
                          className="text-white/10 hover:text-[#c98228] transition-colors p-1"
                          title={`Copiar ${label}`}
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                  ))}
                </div>

                {/* Trip */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                    Viagem
                  </p>
                  {[
                    { label: 'Pacote', value: selectedReservation.trip_name },
                    { label: 'Partida', value: formatDate(selectedReservation.departure_date) },
                    { label: 'Pessoas', value: selectedReservation.num_people.toString() },
                    { label: 'Total', value: formatPrice(selectedReservation.total_price) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                        {label}
                      </span>
                      <div className={`font-body text-sm mt-0.5 ${label === 'Total' ? 'text-gradient font-bold font-display text-base' : 'text-white/70'}`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {selectedReservation.notes && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-2">
                      Observações
                    </p>
                    <p className="font-body text-white/50 text-sm leading-relaxed">
                      {selectedReservation.notes}
                    </p>
                  </div>
                )}

                {/* Created at */}
                <div className="pt-4 border-t border-white/10">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                    Reserva criada em
                  </p>
                  <p className="font-mono text-xs text-white/30 mt-1">
                    {formatDate(selectedReservation.created_at)}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {(['confirmada', 'pendente', 'cancelada'] as const)
                    .filter(s => s !== selectedReservation.status)
                    .map(s => {
                      const SC = statusConfig[s]
                      const SI = SC.icon
                      return (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(selectedReservation.id, s)}
                          disabled={updatingId === selectedReservation.id}
                          className={`w-full flex items-center justify-center gap-2 py-3
                                      font-mono text-[10px] uppercase tracking-widest border
                                      transition-all duration-200 hover:opacity-80
                                      ${SC.classes}`}
                        >
                          <SI size={12} />
                          Marcar como {SC.label}
                        </button>
                      )
                    })}
                  <button
                    onClick={() => handleDelete(selectedReservation.id)}
                    className="w-full flex items-center justify-center gap-2 py-3
                               font-mono text-[10px] uppercase tracking-widest border
                               text-red-400 border-red-400/30 bg-red-400/5
                               hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 size={12} />
                    Excluir Reserva
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
