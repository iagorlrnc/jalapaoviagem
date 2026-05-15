import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass, LogOut, Users, DollarSign, Calendar, TrendingUp,
  Search, ChevronDown, Trash2, CheckCircle, XCircle, Clock,
  RefreshCw, Eye, MessageCircle, Copy, Loader2, Plus, Edit2,
  MapPin, Image as ImageIcon, Star, LayoutGrid, Luggage, UserPlus, Settings, Phone, Mail, Clock4
} from 'lucide-react'
import { 
  getAllReservations, updateReservationStatus, deleteReservation,
  getTrips, createTrip, updateTrip, deleteTrip,
  getDestinations, createDestination, updateDestination, deleteDestination,
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember,
  getSettings, updateSettings, uploadImage,
  getMessages, updateMessageStatus, deleteMessage
} from '../lib/api'
import { 
  Reservation, Trip, Destination, TeamMember, SiteSettings, ContactMessage 
} from '../lib/supabase'

type AdminTab = 'dashboard' | 'reservations' | 'messages' | 'trips' | 'destinations' | 'team' | 'settings'

const statusConfig = {
  pendente: {
    label: 'Pendente',
    icon: Clock,
    classes: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  confirmada: {
    label: 'Confirmada',
    icon: CheckCircle,
    classes: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  cancelada: {
    label: 'Cancelada',
    icon: XCircle,
    classes: 'text-red-600 bg-red-50 border-red-200',
  },
}

const formatPrice = (p: number) =>
  p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [loading, setLoading] = useState(true)
  
  // Data states
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  // UI states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isViewing, setIsViewing] = useState(false)

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated')
    if (!isAuth) {
      navigate('/admin/login')
      return
    }
    loadAllData()
  }, [navigate])

  const loadAllData = async () => {
    setLoading(true)
    const [resData, tripData, destData, teamData, settingsData, msgData] = await Promise.all([
      getAllReservations(),
      getTrips(true),
      getDestinations(true),
      getTeamMembers(),
      getSettings(),
      getMessages()
    ])
    setReservations(resData)
    setTrips(tripData)
    setDestinations(destData)
    setTeam(teamData)
    setSettings(settingsData)
    setMessages(msgData || [])
    console.log('Mensagens carregadas:', msgData)
    setLoading(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-dusk flex overflow-hidden h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 flex flex-col z-50">
        <div className="p-8 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c98228] flex items-center justify-center rounded-lg shadow-lg shadow-[#c98228]/20">
              <Compass size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-body text-black">Admin Portal</h1>
              <p className="font-body text-black text-[10px] uppercase tracking-widest">Jalapão Selvagem</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
            { id: 'reservations', icon: Calendar, label: 'Reservas' },
            { id: 'messages', icon: MessageCircle, label: 'Mensagens' },
            { id: 'trips', icon: Luggage, label: 'Viagens' },
            { id: 'destinations', icon: MapPin, label: 'Destinos' },
            { id: 'team', icon: Users, label: 'Nossa Equipe' },
            { id: 'settings', icon: Settings, label: 'Configurações' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as AdminTab)
                setSelectedItem(null)
                setIsEditing(false)
                setIsAdding(false)
                setSearchQuery('')
                loadAllData() // Refresh data on switch
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-black text-[11px] uppercase tracking-wider transition-all duration-300
                          ${activeTab === item.id 
                            ? 'bg-sand-500 text-white shadow-lg shadow-sand-500/20 font-bold' 
                            : 'text-black/70 hover:bg-black/5'}`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-black text-[11px] uppercase tracking-wider text-red-500 hover:bg-red-50 transition-all duration-300"
          >
            <LogOut size={16} />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-black/5 px-8 py-6 flex items-center justify-between z-40">
          <div>
            <h2 className="font-body text-2xl font-bold text-black">
              {activeTab === 'dashboard' && 'Visão Geral'}
              {activeTab === 'reservations' && 'Gestão de Reservas'}
              {activeTab === 'messages' && 'Central de Mensagens'}
              {activeTab === 'trips' && 'Catálogo de Viagens'}
              {activeTab === 'destinations' && 'Destinos Imperdíveis'}
              {activeTab === 'team' && 'Gestão da Equipe'}
              {activeTab === 'settings' && 'Informações de Contato'}
            </h2>
            <p className="font-body text-black text-[10px] uppercase tracking-wider mt-1">
              Painel de controle
            </p>
          </div>
          <div className="flex items-center gap-4">
            {activeTab !== 'settings' && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-night/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="bg-black/5 border-none rounded-full pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-sand-500/20 w-64 transition-all"
                />
              </div>
            )}
            <button
              onClick={loadAllData}
              className="p-2 text-black/70 hover:text-sand-600 transition-colors"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            {activeTab !== 'reservations' && activeTab !== 'messages' && activeTab !== 'settings' && activeTab !== 'dashboard' && (
              <button
                onClick={() => {
                  setIsAdding(true)
                  setSelectedItem(null)
                }}
                className="btn-primary py-2 px-4 text-[10px] rounded-full flex items-center gap-2"
              >
                <Plus size={14} /> Novo Item
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-dusk/50 backdrop-blur-sm z-50">
              <div className="w-12 h-12 border-4 border-sand-200 border-t-sand-600 rounded-full animate-spin" />
              <p className="font-body text-[10px] text-black/70 uppercase tracking-[0.2em]">Sincronizando dados...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
              {activeTab === 'dashboard' && <DashboardView reservations={reservations} trips={trips} destinations={destinations} messages={messages} onTabChange={setActiveTab} onView={(r: any) => { setSelectedItem(r); setIsViewing(true); }} />}
              {activeTab === 'reservations' && <ReservationsList reservations={reservations} setReservations={setReservations} searchQuery={searchQuery} onView={(r: any) => { setSelectedItem(r); setIsViewing(true); }} />}
              {activeTab === 'messages' && <MessagesList messages={messages} setMessages={setMessages} searchQuery={searchQuery} onView={(m: any) => { setSelectedItem(m); setIsViewing(true); }} />}
              {activeTab === 'trips' && <TripsList trips={trips} setTrips={setTrips} onEdit={(t: any) => { setSelectedItem(t); setIsEditing(true); }} searchQuery={searchQuery} />}
              {activeTab === 'destinations' && <DestinationsList destinations={destinations} setDestinations={setDestinations} onEdit={(d: any) => { setSelectedItem(d); setIsEditing(true); }} searchQuery={searchQuery} />}
              {activeTab === 'team' && <TeamList team={team} setTeam={setTeam} onEdit={(m: any) => { setSelectedItem(m); setIsEditing(true); }} searchQuery={searchQuery} />}
              {activeTab === 'settings' && <SettingsForm initialSettings={settings} onSave={async (data: any) => {
                const res = await updateSettings(data);
                if (res.data) setSettings(res.data);
                alert('Configurações salvas com sucesso!');
              }} />}
            </div>
          )}
        </div>

        {/* Edit/Add/View Overlay */}
        {(isEditing || isAdding || isViewing) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setIsEditing(false); setIsAdding(false); setIsViewing(false); setSelectedItem(null); }} />
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl p-10 overflow-y-auto animate-slide-left">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="font-body text-2xl font-bold text-black">
                    {isAdding ? 'Novo Registro' : isViewing ? (activeTab === 'messages' ? 'Detalhes da Mensagem' : 'Detalhes da Reserva') : 'Editar Informações'}
                  </h3>
                  <p className="font-body text-black text-[10px] uppercase tracking-wider mt-1">
                    {activeTab === 'trips' && 'Módulo de Viagens'}
                    {activeTab === 'destinations' && 'Módulo de Destinos'}
                    {activeTab === 'team' && 'Módulo de Equipe'}
                    {activeTab === 'reservations' && 'Módulo de Reservas'}
                    {activeTab === 'messages' && 'Módulo de Comunicação'}
                    {activeTab === 'dashboard' && 'Visualização de Dados'}
                  </p>
                </div>
                <button onClick={() => { setIsEditing(false); setIsAdding(false); setIsViewing(false); setSelectedItem(null); }} className="text-night/30 hover:text-night p-2 border border-black/5 rounded-full">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {isViewing && selectedItem && activeTab === 'reservations' && (
                  <ReservationDetails 
                    item={selectedItem} 
                    onStatusChange={async (id, status) => {
                      await updateReservationStatus(id, status);
                      setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
                      setSelectedItem({ ...selectedItem, status });
                    }}
                    onDelete={async (id) => {
                      if (!confirm('Deseja realmente deletar esta reserva?')) return;
                      await deleteReservation(id);
                      setReservations(reservations.filter(r => r.id !== id));
                      setIsViewing(false);
                      setSelectedItem(null);
                    }}
                  />
                )}

                {isViewing && selectedItem && activeTab === 'messages' && (
                  <MessageDetails 
                    item={selectedItem} 
                    onStatusChange={async (id: string, status: ContactMessage['status']) => {
                      await updateMessageStatus(id, status);
                      setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
                      setSelectedItem({ ...selectedItem, status });
                    }}
                    onDelete={async (id: string) => {
                      if (!confirm('Deseja realmente deletar esta mensagem?')) return;
                      await deleteMessage(id);
                      setMessages(messages.filter(m => m.id !== id));
                      setIsViewing(false);
                      setSelectedItem(null);
                    }}
                  />
                )}
                
                {activeTab === 'trips' && !isViewing && <TripForm item={selectedItem} onSave={async (data: any) => {
                  if (isAdding) {
                    const res = await createTrip(data);
                    if (res.data) setTrips([...trips, res.data]);
                  } else {
                    const res = await updateTrip(selectedItem.id, data);
                    if (res.data) setTrips(trips.map(t => t.id === selectedItem.id ? res.data : t));
                  }
                  setIsEditing(false); setIsAdding(false); setSelectedItem(null);
                }} />}

                {activeTab === 'destinations' && <DestinationForm item={selectedItem} onSave={async (data: any) => {
                  if (isAdding) {
                    const res = await createDestination(data);
                    if (res.data) setDestinations([...destinations, res.data]);
                  } else {
                    const res = await updateDestination(selectedItem.id, data);
                    if (res.data) setDestinations(destinations.map(d => d.id === selectedItem.id ? res.data : d));
                  }
                  setIsEditing(false); setIsAdding(false); setSelectedItem(null);
                }} />}

                {activeTab === 'team' && <TeamForm item={selectedItem} onSave={async (data: any) => {
                  if (isAdding) {
                    const res = await createTeamMember(data);
                    if (res.data) setTeam([...team, res.data]);
                  } else {
                    const res = await updateTeamMember(selectedItem.id, data);
                    if (res.data) setTeam(team.map(m => m.id === selectedItem.id ? res.data : m));
                  }
                  setIsEditing(false); setIsAdding(false); setSelectedItem(null);
                }} />}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function ReservationDetails({ item, onStatusChange, onDelete }: { item: Reservation, onStatusChange: (id: string, s: Reservation['status']) => void, onDelete: (id: string) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 p-6 bg-black/5 rounded-[2rem]">
          <p className="font-body text-[10px] uppercase tracking-wider text-black/40 mb-1">Status da Reserva</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-widest border ${statusConfig[item.status as keyof typeof statusConfig].classes}`}>
            {statusConfig[item.status as keyof typeof statusConfig].label}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">Cliente</p>
            <p className="font-body text-black font-bold">{item.client_name}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">E-mail</p>
            <p className="font-body text-black">{item.client_email}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">Telefone</p>
            <p className="font-body text-black">{item.client_phone}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">CPF</p>
            <p className="font-body text-black">{item.client_cpf}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">Viagem</p>
            <p className="font-body text-black font-bold">{item.trip_name}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">Data de Partida</p>
            <p className="font-body text-black">{new Date(item.departure_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">Pessoas</p>
            <p className="font-body text-black">{item.num_people}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">Total</p>
            <p className="font-body text-[#c98228] font-bold text-xl">R$ {Number(item.total_price).toLocaleString()}</p>
          </div>
        </div>

        {item.notes && (
          <div className="col-span-2">
            <p className="font-body text-[10px] uppercase tracking-wider text-black/40">Observações</p>
            <p className="font-body text-black italic bg-sand-50 p-4 rounded-2xl border border-sand-100 mt-2">"{item.notes}"</p>
          </div>
        )}
      </div>

      <div className="pt-8 flex flex-col gap-3 border-t border-black/5">
        <div className="flex gap-3">
          {item.status === 'pendente' && (
            <>
              <button onClick={() => onStatusChange(item.id, 'confirmada')} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Aprovar Reserva
              </button>
              <button onClick={() => onStatusChange(item.id, 'cancelada')} className="flex-1 py-4 bg-white border border-red-200 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                <XCircle size={18} /> Cancelar
              </button>
            </>
          )}
          {item.status === 'confirmada' && (
            <button onClick={() => onStatusChange(item.id, 'cancelada')} className="flex-1 py-4 bg-white border border-red-200 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
              <XCircle size={18} /> Cancelar Reserva
            </button>
          )}
          {item.status === 'cancelada' && (
            <>
              <button onClick={() => onStatusChange(item.id, 'confirmada')} className="flex-1 py-4 bg-white border border-emerald-200 text-emerald-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                <RefreshCw size={18} /> Reaprovar Reserva
              </button>
              <button onClick={() => onDelete(item.id)} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
                <Trash2 size={18} /> Deletar Registro
              </button>
            </>
          )}
        </div>

        <div className="flex justify-between items-center px-2 mt-2">
          <div>
            <p className="font-body text-[8px] uppercase tracking-wider text-black/20">ID: {item.id}</p>
            <p className="font-body text-[8px] uppercase tracking-wider text-black/20">Criado em: {new Date(item.created_at || '').toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReservationsList({ reservations, setReservations, searchQuery, onView }: any) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'confirmada' | 'cancelada'>('all')
  
  const handleStatusChange = async (id: string, status: Reservation['status']) => {
    setUpdatingId(id)
    await updateReservationStatus(id, status)
    setReservations((prev: any) => prev.map((r: any) => r.id === id ? { ...r, status } : r))
    setUpdatingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta reserva permanentemente?')) return
    await deleteReservation(id)
    setReservations((prev: any) => prev.filter((r: any) => r.id !== id))
  }

  const filtered = reservations.filter((r: any) => {
    const matchesSearch = !searchQuery || 
      [r.client_name, r.trip_name, r.client_email].some(v => v?.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex gap-2 p-1 bg-black/5 rounded-2xl w-fit">
        {(['all', 'pendente', 'confirmada', 'cancelada'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl font-body text-[9px] uppercase tracking-widest transition-all ${
              statusFilter === s ? 'bg-white text-night shadow-sm font-bold' : 'text-black/70 hover:text-night/60'
            }`}
          >
            {s === 'all' ? 'Todas' : s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                {['Cliente', 'Viagem', 'Status', 'Total', 'Ações'].map(h => (
                  <th key={h} className="text-left p-6 font-body text-[10px] uppercase tracking-wider text-black/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((r: any) => (
                <tr 
                  key={r.id} 
                  onClick={() => onView(r)}
                  className="hover:bg-black/2 transition-colors cursor-pointer group"
                >
                  <td className="p-6">
                    <div className="font-body text-black text-sm group-hover:text-sand-600 transition-colors">{r.client_name}</div>
                    <div className="font-body text-[9px] text-night/30 mt-1">{r.client_email}</div>
                  </td>
                  <td className="p-6">
                    <div className="font-body text-night/70 text-sm">{r.trip_name}</div>
                    <div className="font-body text-[9px] text-night/30 mt-1">{new Date(r.departure_date).toLocaleDateString()}</div>
                  </td>
                  <td className="p-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-[9px] uppercase tracking-widest border ${statusConfig[r.status as keyof typeof statusConfig].classes}`}>
                      {r.status}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="font-body font-bold text-[#c98228] text-sm">R$ {Number(r.total_price).toLocaleString()}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(r.id, 'confirmada'); }} 
                        className="text-emerald-500 hover:scale-110 transition-transform"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(r.id, 'cancelada'); }} 
                        className="text-red-400 hover:scale-110 transition-transform"
                      >
                        <XCircle size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} 
                        className="text-night/20 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TripsList({ trips, setTrips, onEdit, searchQuery }: any) {
  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta viagem?')) return
    await deleteTrip(id)
    setTrips(trips.filter((t: any) => t.id !== id))
  }

  const filtered = trips.filter((t: any) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filtered.map((t: any) => (
        <div key={t.id} className="bg-white rounded-[2rem] p-6 border border-black/5 hover:shadow-xl transition-all duration-300 group">
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner">
              <img src={t.image_url} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-body text-black text-lg">{t.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-body text-[9px] text-[#c98228] uppercase tracking-widest">{t.location}</span>
                    <span className="text-night/10">•</span>
                    <span className={`font-body text-[8px] px-1.5 py-0.5 rounded ${t.difficulty === 'Fácil' ? 'bg-emerald-50 text-emerald-600' : t.difficulty === 'Moderado' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                      {t.difficulty}
                    </span>
                    {!t.is_active && (
                      <span className="font-body text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-bold">
                        Inativa
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(t)} className="p-2 text-night/20 hover:text-sand-600 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 text-night/20 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="font-body font-bold text-gradient">{formatPrice(t.price)}</div>
                <div className="font-body text-black text-[10px] uppercase tracking-widest bg-black/5 px-2 py-1 rounded-md">
                  {t.available_spots}/{t.max_spots} vagas
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DestinationsList({ destinations, setDestinations, onEdit, searchQuery }: any) {
  const handleDelete = async (id: string) => {
    if (!confirm('Remover este destino?')) return
    await deleteDestination(id)
    setDestinations(destinations.filter((d: any) => d.id !== id))
  }

  const filtered = destinations.filter((d: any) => !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filtered.map((d: any) => (
        <div key={d.id} className="bg-white rounded-[2rem] overflow-hidden border border-black/5 hover:shadow-xl transition-all duration-300 group">
          <div className="h-48 relative">
            <img src={d.image_url} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => onEdit(d)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-black/70 hover:text-sand-600 transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(d.id)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-black/70 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
            </div>
            {!d.is_active && (
              <div className="absolute top-4 left-4">
                <span className="font-body text-[8px] bg-red-500 text-white px-2 py-1 rounded-full uppercase font-bold shadow-lg">
                  Oculto
                </span>
              </div>
            )}
          </div>
          <div className="p-6">
            <span className="font-body text-[8px] uppercase tracking-widest bg-sand-50 text-[#c98228] px-2 py-1 rounded-full">{d.tag}</span>
            <h4 className="font-body text-black text-lg mt-3">{d.name}</h4>
            <p className="font-body text-black/70 text-xs mt-2 line-clamp-2">{d.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function TeamList({ team, setTeam, onEdit, searchQuery }: any) {
  const handleDelete = async (id: string) => {
    if (!confirm('Remover este membro?')) return
    await deleteTeamMember(id)
    setTeam(team.filter((m: any) => m.id !== id))
  }

  const filtered = team.filter((m: any) => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filtered.map((m: any) => (
        <div key={m.id} className="bg-white rounded-[2.5rem] p-8 border border-black/5 hover:shadow-xl transition-all duration-300 text-center relative group">
          <button onClick={() => onEdit(m)} className="absolute top-6 right-6 p-2 text-night/10 hover:text-sand-600 transition-colors"><Edit2 size={14} /></button>
          <button onClick={() => handleDelete(m.id)} className="absolute top-6 left-6 p-2 text-night/10 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
          
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg border border-black/5 bg-sand-50 flex items-center justify-center relative">
            {m.image_url ? (
              <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-body text-2xl font-black text-[#c98228]">
                {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
            )}
          </div>
          <h4 className="font-body text-black text-xl">{m.name}</h4>
          <p className="font-body text-[10px] text-[#c98228] uppercase tracking-widest mt-2">{m.role}</p>
          <p className="font-body text-night/30 text-xs mt-4">{m.years_experience}</p>
        </div>
      ))}
    </div>
  )
}

// ─── VIEWS ────────────────────────────────────────────────────────────────────

function DashboardView({ 
  reservations, 
  trips, 
  destinations, 
  messages, 
  onView, 
  onTabChange 
}: { 
  reservations: Reservation[], 
  trips: Trip[], 
  destinations: any[], 
  messages: ContactMessage[], 
  onView: (r: any) => void,
  onTabChange: (tab: AdminTab) => void
}) {
  const totalRevenue = reservations
    .filter(r => r.status === 'confirmada')
    .reduce((sum, r) => sum + Number(r.total_price), 0)
  
  const pendingReservations = reservations.filter(r => r.status === 'pendente').length
  const unreadMessages = messages.filter(m => m.status === 'unread').length
  const totalConfirmedPeople = reservations
    .filter(r => r.status === 'confirmada')
    .reduce((sum, r) => sum + Number(r.num_people), 0)
  
  const stats = [
    { label: 'Receita Total', value: `R$ ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Reservas Pendentes', value: pendingReservations, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Mensagens Novas', value: unreadMessages, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Viajantes Confirmados', value: totalConfirmedPeople, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Destinos Ativos', value: destinations.filter((d: any) => d.is_active).length, icon: MapPin, color: 'text-[#c98228]', bg: 'bg-sand-50' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="font-body text-3xl font-bold text-night">Bem-vindo</h2>
        <p className="font-body text-black/70">Veja o que está acontecendo no Jalapão Turismo hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <s.icon size={20} />
            </div>
            <p className="font-body text-[9px] uppercase tracking-widest text-black mb-1 font-bold">{s.label}</p>
            <h3 className="font-body text-2xl font-bold text-black">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] border border-black/5 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-body text-xl font-bold text-night">Reservas Recentes</h3>
            <span className="font-body text-[10px] text-[#c98228] bg-sand-50 px-3 py-1 rounded-full uppercase tracking-wider">Últimas 5</span>
          </div>
          <div className="space-y-4">
            {reservations.slice(0, 5).map(r => (
              <div 
                key={r.id} 
                onClick={() => onView(r)}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.status === 'confirmada' ? 'bg-green-50 text-green-600' : r.status === 'pendente' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                    {r.status === 'confirmada' ? <CheckCircle size={18} /> : r.status === 'pendente' ? <Clock size={18} /> : <XCircle size={18} />}
                  </div>
                  <div>
                    <h4 className="font-body text-black text-sm group-hover:text-sand-600 transition-colors font-bold">{r.client_name}</h4>
                    <p className="font-body text-night/30 text-xs">{r.trip_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body text-black text-sm font-bold">R$ {Number(r.total_price).toLocaleString()}</p>
                  <p className="font-body text-[9px] text-night/20 uppercase">{new Date(r.departure_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-black/5 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-body text-xl font-bold text-night">Mensagens Recentes</h3>
            <span className="font-body text-[10px] text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Novas</span>
          </div>
          <div className="space-y-4">
            {messages.slice(0, 5).map(m => (
              <div 
                key={m.id} 
                onClick={() => { onTabChange('messages'); onView(m); }}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.status === 'unread' ? 'bg-blue-50 text-blue-600' : 'bg-black/5 text-night/30'}`}>
                    {m.status === 'unread' ? <Mail size={18} /> : <Eye size={18} />}
                  </div>
                  <div>
                    <h4 className="font-body text-black text-sm group-hover:text-sand-600 transition-colors font-bold">{m.name}</h4>
                    <p className="font-body text-night/30 text-xs truncate max-w-[150px]">{m.subject || 'Sem assunto'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body text-black text-[10px] font-bold">{formatDate(m.created_at)}</p>
                  <p className="font-body text-[8px] text-night/20 uppercase">{m.status === 'unread' ? 'Pendente' : 'Lida'}</p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="py-12 text-center text-night/20">
                Nenhuma mensagem recente.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── FORMS ────────────────────────────────────────────────────────────────────

function ImageUpload({ label, currentUrl, onUpload }: { label: string, currentUrl?: string, onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    const url = await uploadImage(file)
    if (url) onUpload(url)
    setUploading(false)
  }

  return (
    <div className="space-y-2">
      <label className="label">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-black/5 rounded-2xl overflow-hidden border border-black/5 flex items-center justify-center shrink-0">
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-[#c98228]" />
          ) : currentUrl ? (
            <img src={currentUrl} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={24} className="text-night/10" />
          )}
        </div>
        <div className="flex-1">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFile} 
            className="hidden" 
            id={`file-${label}`}
          />
          <label 
            htmlFor={`file-${label}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-xl font-body text-[9px] uppercase tracking-widest text-night/60 hover:bg-black/5 cursor-pointer transition-all"
          >
            {uploading ? 'Enviando...' : currentUrl ? 'Alterar Imagem' : 'Fazer Upload'}
          </label>
          <p className="font-body text-[8px] text-night/20 mt-2 uppercase tracking-widest">
            PNG, JPG ou WEBP. Máx 5MB.
          </p>
        </div>
      </div>
    </div>
  )
}

function ArrayEditor({ label, items, onChange, placeholder }: { label: string, items: string[], onChange: (items: string[]) => void, placeholder: string }) {
  const [input, setInput] = useState('')
  
  const addItem = () => {
    if (input.trim()) {
      onChange([...items, input.trim()])
      setInput('')
    }
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input 
          className="input-field rounded-xl flex-1" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && addItem()}
          placeholder={placeholder}
        />
        <button onClick={addItem} className="p-2 bg-sand-50 text-[#c98228] rounded-xl hover:bg-[#c98228] hover:text-white transition-all">
          <Plus size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, i) => (
          <span key={i} className="px-3 py-1 bg-black/5 rounded-full font-body text-[9px] uppercase tracking-widest text-night/60 flex items-center gap-2">
            {item}
            <button onClick={() => removeItem(i)} className="hover:text-red-600"><XCircle size={12} /></button>
          </span>
        ))}
      </div>
    </div>
  )
}

function TripForm({ item, onSave }: any) {
  const [form, setForm] = useState(item || { 
    name: '', 
    price: 0, 
    max_spots: 10, 
    available_spots: 10, 
    departure_date: '', 
    return_date: '',
    location: 'Jalapão, TO', 
    duration_days: 1,
    image_url: '', 
    description: '', 
    difficulty: 'Moderado',
    highlights: [],
    includes: [],
    is_active: true
  })

  const handleDateChange = (field: 'departure_date' | 'return_date', value: string) => {
    const newForm = { ...form, [field]: value }
    
    if (newForm.departure_date && newForm.return_date) {
      const start = new Date(newForm.departure_date)
      const end = new Date(newForm.return_date)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1)
      newForm.duration_days = diffDays
    }
    
    setForm(newForm)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Nome da Viagem</label>
          <input className="input-field rounded-2xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: Expedição Dunas e Fervedouros" />
        </div>
        
        <div className="col-span-2">
          <label className="label">Descrição Detalhada</label>
          <textarea className="input-field rounded-2xl h-24" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Descreva os detalhes da aventura..." />
        </div>

        <div>
          <label className="label">Preço (R$)</label>
          <input type="number" className="input-field rounded-2xl" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
        </div>
        
        <div>
          <label className="label">Localização</label>
          <input className="input-field rounded-2xl" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        </div>

        <div>
          <label className="label">Data Partida</label>
          <input type="date" className="input-field rounded-2xl" value={form.departure_date} onChange={e => handleDateChange('departure_date', e.target.value)} />
        </div>
        
        <div>
          <label className="label">Data Retorno</label>
          <input type="date" className="input-field rounded-2xl" value={form.return_date} onChange={e => handleDateChange('return_date', e.target.value)} />
        </div>

        <div>
          <label className="label">Vagas Totais</label>
          <input type="number" className="input-field rounded-2xl" value={form.max_spots} onChange={e => setForm({...form, max_spots: Number(e.target.value)})} />
        </div>
        
        <div>
          <label className="label">Vagas Disponíveis</label>
          <input type="number" className="input-field rounded-2xl" value={form.available_spots} onChange={e => setForm({...form, available_spots: Number(e.target.value)})} />
        </div>

        <div>
          <label className="label">Dificuldade</label>
          <select className="input-field rounded-2xl" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
            <option value="Fácil">Fácil</option>
            <option value="Moderado">Moderado</option>
            <option value="Difícil">Difícil</option>
          </select>
        </div>

        <div>
          <label className="label">Duração (Dias)</label>
          <input 
            type="number" 
            className="input-field rounded-2xl bg-black/5 cursor-not-allowed" 
            value={form.duration_days} 
            readOnly 
            placeholder="Calculado automaticamente"
          />
        </div>

        <div className="col-span-2">
          <ImageUpload 
            label="Imagem de Capa" 
            currentUrl={form.image_url} 
            onUpload={(url) => setForm({...form, image_url: url})} 
          />
        </div>

        <div className="col-span-2 space-y-4">
          <ArrayEditor 
            label="Destaques (Highlights)" 
            items={form.highlights || []} 
            onChange={(items) => setForm({...form, highlights: items})} 
            placeholder="Ex: Pôr do sol nas Dunas" 
          />
          <ArrayEditor 
            label="O que inclui (Includes)" 
            items={form.includes || []} 
            onChange={(items) => setForm({...form, includes: items})} 
            placeholder="Ex: Transporte 4x4" 
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input 
            type="checkbox" 
            id="is_active" 
            checked={form.is_active} 
            onChange={e => setForm({...form, is_active: e.target.checked})}
            className="w-4 h-4 accent-sand-600"
          />
          <label htmlFor="is_active" className="font-body text-[10px] uppercase tracking-widest text-night/60 cursor-pointer">
            Viagem Ativa (Visível no site)
          </label>
        </div>
      </div>

      <button onClick={() => onSave(form)} className="btn-primary w-full py-4 mt-6 rounded-full">
        Finalizar e Salvar Viagem
      </button>
    </div>
  )
}

function DestinationForm({ item, onSave }: any) {
  const [form, setForm] = useState(item || { name: '', tag: '', description: '', image_url: '', rating: 5, is_active: true })
  
  return (
    <div className="space-y-6">
      <div>
        <label className="label">Nome do Destino</label>
        <input className="input-field rounded-2xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      </div>
      <div>
        <label className="label">Tag (ex: Fenômeno Natural)</label>
        <input className="input-field rounded-2xl" value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} />
      </div>
      
      <ImageUpload 
        label="Imagem do Destino" 
        currentUrl={form.image_url} 
        onUpload={(url) => setForm({...form, image_url: url})} 
      />

      <div>
        <label className="label">Descrição Curta</label>
        <textarea className="input-field rounded-2xl h-32" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input 
          type="checkbox" 
          id="is_active_dest" 
          checked={form.is_active} 
          onChange={e => setForm({...form, is_active: e.target.checked})}
          className="w-4 h-4 accent-sand-600"
        />
        <label htmlFor="is_active_dest" className="font-body text-[10px] uppercase tracking-widest text-night/60 cursor-pointer">
          Destino Ativo (Visível no site)
        </label>
      </div>

      <button onClick={() => onSave(form)} className="btn-primary w-full py-4 mt-6 rounded-full">Salvar Destino</button>
    </div>
  )
}

function TeamForm({ item, onSave }: any) {
  const [form, setForm] = useState(item || { name: '', role: '', years_experience: '', image_url: '' })
  
  return (
    <div className="space-y-6">
      <div>
        <label className="label">Nome do Membro</label>
        <input className="input-field rounded-2xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      </div>
      <div>
        <label className="label">Cargo/Função</label>
        <input className="input-field rounded-2xl" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
      </div>
      <div>
        <label className="label">Experiência (ex: Nativo de Mateiros)</label>
        <input className="input-field rounded-2xl" value={form.years_experience} onChange={e => setForm({...form, years_experience: e.target.value})} />
      </div>

      <ImageUpload 
        label="Foto de Perfil" 
        currentUrl={form.image_url} 
        onUpload={(url) => setForm({...form, image_url: url})} 
      />

      <button onClick={() => onSave(form)} className="btn-primary w-full py-4 mt-6 rounded-full">Salvar Membro</button>
    </div>
  )
}

function SettingsForm({ initialSettings, onSave }: any) {
  const [form, setForm] = useState(initialSettings || { 
    whatsapp: '', 
    email: '', 
    address: '', 
    working_hours: '',
    instagram_url: '',
    facebook_url: '',
    maps_url: ''
  })

  return (
    <div className="bg-white rounded-[2rem] p-10 border border-black/5 shadow-sm space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sand-600 mb-2">
            <Phone size={18} />
            <h4 className="font-body font-bold text-night">Canais de Contato</h4>
          </div>
          <div>
            <label className="label">WhatsApp (Apenas números com DDD)</label>
            <input 
              className="input-field rounded-2xl" 
              value={form.whatsapp} 
              onChange={e => setForm({...form, whatsapp: maskPhone(e.target.value)})} 
              placeholder="(63) 99999-9999" 
            />
          </div>
          <div>
            <label className="label">E-mail Comercial</label>
            <input className="input-field rounded-2xl" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="contato@empresa.com" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sand-600 mb-2">
            <MapPin size={18} />
            <h4 className="font-body font-bold text-night">Localização e Horários</h4>
          </div>
          <div>
            <label className="label">Endereço Físico</label>
            <input className="input-field rounded-2xl" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <div>
            <label className="label">Link do Google Maps</label>
            <input 
              className="input-field rounded-2xl" 
              value={form.maps_url || ''} 
              onChange={e => setForm({...form, maps_url: e.target.value})} 
              placeholder="https://goo.gl/maps/..."
            />
          </div>
          <div>
            <label className="label">Horário de Atendimento</label>
            <input className="input-field rounded-2xl" value={form.working_hours} onChange={e => setForm({...form, working_hours: e.target.value})} placeholder="Ex: Seg a Sex, 08h às 18h" />
          </div>
        </div>

        <div className="col-span-full space-y-4 border-t border-black/5 pt-8">
          <div className="flex items-center gap-3 text-sand-600 mb-2">
            <TrendingUp size={18} />
            <h4 className="font-body font-bold text-night">Redes Sociais</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">URL Instagram</label>
              <input className="input-field rounded-2xl" value={form.instagram_url} onChange={e => setForm({...form, instagram_url: e.target.value})} />
            </div>
            <div>
              <label className="label">URL Facebook</label>
              <input className="input-field rounded-2xl" value={form.facebook_url} onChange={e => setForm({...form, facebook_url: e.target.value})} />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-6">
        <button onClick={() => onSave(form)} className="btn-primary w-full py-4 rounded-full flex items-center justify-center gap-3">
          <RefreshCw size={18} /> Salvar Configurações Globais
        </button>
      </div>
    </div>
  )
}

function MessagesList({ messages, setMessages, searchQuery, onView }: { messages: ContactMessage[], setMessages: any, searchQuery: string, onView: any }) {
  const filtered = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const msgStatusConfig = {
    unread: { label: 'Não lida', icon: Mail, classes: 'text-blue-600 bg-blue-50 border-blue-200' },
    read: { label: 'Lida', icon: Eye, classes: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    archived: { label: 'Arquivada', icon: Clock4, classes: 'text-night/40 bg-black/5 border-black/10' }
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/5 border-b border-black/5">
            <tr>
              <th className="px-8 py-5 font-body text-[10px] uppercase tracking-widest text-black/40">Remetente</th>
              <th className="px-8 py-5 font-body text-[10px] uppercase tracking-widest text-black/40">Assunto</th>
              <th className="px-8 py-5 font-body text-[10px] uppercase tracking-widest text-black/40">Data</th>
              <th className="px-8 py-5 font-body text-[10px] uppercase tracking-widest text-black/40">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-night/20">
                    <MessageCircle size={40} strokeWidth={1} />
                    <p className="font-body text-sm uppercase tracking-widest">Nenhuma mensagem recebida</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(msg => (
                <tr 
                  key={msg.id} 
                  onClick={() => onView(msg)}
                  className="hover:bg-black/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-body font-bold text-night text-sm">{msg.name}</span>
                      <span className="font-mono text-[10px] text-night/30">{msg.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-body text-sm text-night/60">{msg.subject || 'Sem assunto'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-[11px] text-night/40">{formatDate(msg.created_at)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${msgStatusConfig[msg.status].classes}`}>
                      {msgStatusConfig[msg.status].label}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => onView(msg)}
                      className="p-2 text-night/20 hover:text-sand-600 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MessageDetails({ item, onStatusChange, onDelete }: { item: ContactMessage, onStatusChange: any, onDelete: any }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="bg-black/5 p-6 rounded-3xl">
          <p className="label mb-4">Informações de Contato</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-night">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Users size={16} className="text-sand-600" />
              </div>
              <span className="text-sm font-bold">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 text-night/60">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Mail size={16} className="text-sand-600" />
              </div>
              <span className="text-sm">{item.email}</span>
            </div>
            {item.phone && (
              <div className="flex items-center gap-3 text-night/60">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Phone size={16} className="text-sand-600" />
                </div>
                <span className="text-sm">{item.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-black/5 p-6 rounded-3xl">
          <p className="label mb-4">Metadata</p>
          <div className="flex gap-8">
            <div className="flex items-center gap-3 text-night/60">
              <Calendar size={16} className="text-sand-600" />
              <span className="text-sm font-mono">{formatDate(item.created_at)}</span>
            </div>
            <div className="flex items-center gap-3 text-night/60">
              <Clock size={16} className="text-sand-600" />
              <span className="text-sm font-mono">{new Date(item.created_at).toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/5 p-8 rounded-[2rem]">
        <p className="label mb-4">Mensagem</p>
        <div className="font-body text-night leading-relaxed whitespace-pre-wrap text-sm italic">
          "{item.message}"
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-6 border-t border-black/5">
        <div className="flex gap-3">
          {item.status === 'unread' ? (
            <button
              onClick={() => onStatusChange(item.id, 'read')}
              className="flex-1 btn-primary py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Marcar como Lida
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(item.id, 'unread')}
              className="flex-1 border border-black/10 text-night/60 hover:bg-black/5 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Mail size={18} /> Marcar como Não Lida
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            className="w-16 border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center rounded-2xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
        
        {item.phone && (
          <a
            href={`https://wa.me/${item.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:brightness-95 transition-all shadow-lg shadow-emerald-500/10"
          >
            <MessageCircle size={18} /> Responder via WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
