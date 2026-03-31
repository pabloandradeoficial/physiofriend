import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import AgentCard from '@/components/agents/AgentCard'
import { AGENTS } from '@/constants/agents'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || 'Fisioterapeuta'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>

      {/* Header greeting */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d4a843' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#9ca3af', letterSpacing: '0.12em' }}>
            {greeting}
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-semibold mb-2"
          style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
        >
          {greeting}, <span style={{ color: '#d4a843' }}>{displayName}</span>
        </h1>
        <p className="text-sm font-light" style={{ color: '#9ca3af' }}>
          Selecione um agente especialista para iniciar seu raciocínio clínico.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          {
            label: 'Agentes disponíveis',
            value: '5',
            sub: 'especialidades',
            icon: Sparkles,
          },
          {
            label: 'Conversas recentes',
            value: '—',
            sub: 'nenhuma ainda',
            icon: Clock,
          },
          {
            label: 'Casos salvos',
            value: '—',
            sub: 'nenhum ainda',
            icon: TrendingUp,
          },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5"
            style={{
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>{label}</p>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#faf3e0' }}
              >
                <Icon size={14} style={{ color: '#d4a843' }} />
              </div>
            </div>
            <p className="text-2xl font-semibold mb-0.5" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              {value}
            </p>
            <p className="text-xs font-light" style={{ color: '#c4c4c4' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Agents section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="text-lg font-semibold mb-1"
            style={{ color: '#1a1a1a', letterSpacing: '-0.015em' }}
          >
            Agentes Especialistas
          </h2>
          <p className="text-sm font-light" style={{ color: '#9ca3af' }}>
            Copiloto clínico por área de atuação
          </p>
        </div>
        <button
          onClick={() => navigate('/agents')}
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors duration-150"
          style={{ color: '#d4a843' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#b8902a' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#d4a843' }}
        >
          Ver todos
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Gold divider */}
      <div
        className="mb-8"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, #e8ce85, transparent)',
        }}
      />

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {AGENTS.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>

      {/* Bottom note */}
      <div
        className="mt-12 p-5 rounded-2xl flex items-start gap-4"
        style={{
          backgroundColor: '#fdfaf3',
          border: '1px solid #f3e4b8',
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: '#faf3e0', border: '1px solid #e8ce85' }}
        >
          <Sparkles size={15} style={{ color: '#d4a843' }} />
        </div>
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: '#7a5c18' }}>
            Plataforma em evolução
          </p>
          <p className="text-xs font-light leading-relaxed" style={{ color: '#92650a', opacity: 0.7 }}>
            O PhysioFriend está em fase beta. Novos agentes e funcionalidades serão adicionados em breve.
            Sua contribuição clínica é fundamental para o desenvolvimento da plataforma.
          </p>
        </div>
      </div>

    </div>
  )
}

export default DashboardPage
