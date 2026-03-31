# PhysioFriend

**Plataforma premium de apoio ao raciocínio clínico para fisioterapeutas.**

> Agentes especialistas por área de atuação, funcionando como copiloto inteligente para a prática clínica.

---

## Stack

- **React** + **Vite** + **TypeScript**
- **Tailwind CSS** (v4)
- **Supabase Auth** (Google OAuth)
- **React Router v6**
- **Lucide React** (ícones)
- **Fonte:** Montserrat (Google Fonts)

---

## Estrutura do projeto

```
src/
├── components/
│   ├── agents/
│   │   └── AgentCard.tsx
│   └── layout/
│       └── AppLayout.tsx
├── constants/
│   └── agents.ts
├── features/
│   └── auth/
│       ├── AuthContext.tsx
│       └── ProtectedRoute.tsx
├── lib/
│   └── supabase.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── AgentsPage.tsx
│   ├── AgentChatPage.tsx
│   ├── HistoryPage.tsx
│   ├── SavedPage.tsx
│   └── SettingsPage.tsx
├── types/
│   └── index.ts
└── App.tsx
```

---

## Rotas

| Rota | Página |
|---|---|
| `/login` | Tela de login |
| `/dashboard` | Dashboard principal |
| `/agents` | Listagem de agentes |
| `/agents/orthopedics` | Agente de Ortopedia |
| `/agents/neurology` | Agente de Neurologia |
| `/agents/geriatrics` | Agente de Geriatria |
| `/agents/hospital` | Agente Hospitalar |
| `/agents/homecare` | Agente Domiciliar |
| `/history` | Histórico de conversas |
| `/saved` | Casos salvos |
| `/settings` | Configurações |

---

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 3. Rodar em desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

---

## Configuração Supabase (Google OAuth)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **Authentication → Providers → Google**
3. Ative e configure com seu Google Client ID e Secret
4. Adicione `http://localhost:5173` nas Redirect URLs

---

## Design System

| Elemento | Valor |
|---|---|
| Background | `#f8f7f5` |
| Cards | `#ffffff` |
| Texto principal | `#1a1a1a` |
| Texto secundário | `#9ca3af` |
| Dourado | `#d4a843` |
| Fonte | Montserrat 300/400/500/600 |

---

*PhysioFriend · Beta · v0.1.0*
