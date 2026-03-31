import React from 'react'
import { Bot, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AgentCard from '@/components/agents/AgentCard'
import { AGENTS } from '@/constants/agents'
import { useSubscription } from '@/features/subscription/SubscriptionContext'

const AgentsPage: React.FC = () => {
  const { canAccessAgent, subscription } = useSubscription()
  const navigate = useNavigate()
  const lockedCount = AGENTS.filter(a => !canAccessAgent(a.slug)).length

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>

      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d4a843' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#9ca3af', letterSpacing: '0.12em' }}>
            Biblioteca clínica
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-semibold mb-2"
          style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
        >
          Agentes Especialistas
        </h1>
        <p className="text-sm font-light" style={{ color: '#9ca3af' }}>
          Selecione a especialidade para iniciar o suporte ao raciocínio clínico.
        </p>
      </div>

      {/* Gold divider */}
      <div
        className="mb-8"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, #e8ce85, transparent)',
        }}
      />

      {/* Stats bar */}
      <div className="flex items-center gap-6 mb-8 flex-wrap">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#faf3e0' }}
          >
            <Bot size={14} style={{ color: '#d4a843' }} />
          </div>
          <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
            {AGENTS.length} agentes disponíveis
          </span>
        </div>
        <div className="h-4 w-px" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
        <span className="text-xs font-light" style={{ color: '#9ca3af' }}>
          Mais especialidades em breve
        </span>

        {/* Upgrade nudge — only on free plan */}
        {lockedCount > 0 && subscription.plan === 'free' && (
          <>
            <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
            <button
              onClick={() => navigate('/plans')}
              className="flex items-center gap-1.5 text-xs font-medium transition-all duration-150"
              style={{ color: '#b8902a' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#d4a843' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#b8902a' }}
            >
              <Lock size={11} />
              {lockedCount} {lockedCount === 1 ? 'agente bloqueado' : 'agentes bloqueados'} — fazer upgrade
            </button>
          </>
        )}
      </div>

      {/* Agents grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {AGENTS.map((agent, i) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            index={i}
            locked={!canAccessAgent(agent.slug)}
          />
        ))}
      </div>

    </div>
  )
}

export default AgentsPage
