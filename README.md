# 🌵 Jalapão Selvagem — Site de Turismo

Website completo para agência de turismo focada no Jalapão, Tocantins.  
**Stack:** React + TypeScript + Vite + Tailwind CSS + Supabase

---

## 📁 Estrutura do Projeto

```
jalapao-turismo/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Navbar responsiva com scroll
│   │   ├── HeroSection.tsx       # Hero com parallax
│   │   ├── DestinationsSection.tsx # Grid de destinos
│   │   ├── TripsSection.tsx      # Lista de viagens com filtros
│   │   ├── TripCard.tsx          # Card de viagem individual
│   │   ├── ReservationModal.tsx  # Modal de reserva
│   │   ├── AboutSection.tsx      # Sobre a agência
│   │   └── ContactSection.tsx    # Contato + Footer
│   ├── pages/
│   │   ├── HomePage.tsx          # Página principal
│   │   ├── AdminLoginPage.tsx    # Login do admin
│   │   └── AdminPage.tsx         # Painel administrativo
│   ├── lib/
│   │   ├── supabase.ts           # Cliente Supabase + tipos
│   │   ├── api.ts                # Funções de API (trips + reservations)
│   │   └── mockData.ts           # Dados de exemplo (offline)
│   ├── App.tsx                   # Roteamento
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind + estilos globais
├── supabase-schema.sql           # SQL para criar as tabelas
├── .env.example                  # Exemplo de variáveis de ambiente
└── README.md
```

---

## 🚀 Como Rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_ADMIN_PASSWORD=sua-senha-admin
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

### 4. Build para produção
```bash
npm run build
```

---

## 🗄️ Configurar Supabase

### Criar projeto
1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **SQL Editor** no painel do Supabase
3. Cole e execute o conteúdo de `supabase-schema.sql`

### Variáveis necessárias
No painel do Supabase: **Settings → API**
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` key → `VITE_SUPABASE_ANON_KEY`

> **Modo Offline:** Se o Supabase não estiver configurado, o site usa dados mockados e armazena reservas no `localStorage` automaticamente.

---

## 🔐 Painel Administrativo

- **URL:** `/admin/login`
- **Senha padrão:** `jalapao2024` (definida em `VITE_ADMIN_PASSWORD`)

### Funcionalidades do Admin:
- 📊 Dashboard com estatísticas (receita, reservas, vagas)
- 📋 Tabela completa de reservas com filtros e busca
- 🔄 Atualizar status: Pendente → Confirmada → Cancelada
- 👁️ Painel de detalhes do cliente
- 🗑️ Excluir reservas

---

## 🌐 Páginas e Seções

### Site Principal (`/`)
- **Hero** — Banner com parallax e estatísticas
- **Destinos** — Grid interativo com hover dos 6 principais destinos
- **Viagens** — Cards com filtro por dificuldade, detalhes e reserva
- **Sobre** — História, valores e equipe
- **Contato** — Formulário e informações de contato

### Fluxo de Reserva
1. Cliente clica em "Reservar Esta Viagem"
2. Modal abre com formulário de dados pessoais
3. Resumo do pedido com total calculado
4. Confirmação → reserva salva no Supabase (ou localStorage)
5. Email de confirmação via WhatsApp (manual)

---

## 🎨 Design

- **Tema:** Dark mode com tons terrosos (areia dourada + cerrado)
- **Tipografia:** Playfair Display (display) + Lato (body) + DM Mono (labels)
- **Paleta:** `#c98228` (dourado), `#0f0e0a` (night), `#e8c070` (sand)
- **Estilo:** Editorial / luxury travel com toques brutais

---

## 📦 Deploy

### Vercel (recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy da pasta /dist
```

Adicione as variáveis de ambiente no painel do serviço de deploy.
