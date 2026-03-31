import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bone, Brain, HeartHandshake, Activity, Home, ArrowRight, Lock } from 'lucide-react'
import type { Agent } from '@/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Bone,
  Brain,
  HeartHandshake,
  Activity,
  Home,
}

interface AgentCardProps {
  agent: Agent
  index?: number
  locked?: boolean
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, locked = false }) => {
  const navigate = useNavigate()
  const Icon = ICON_MAP[agent.icon] || Bot
  const [showUpgradeHint, setShowUpgradeHint] = useState(false)

  const handleClick = () => {
    if (locked) {
      setShowUpgradeHint(true)
      setTimeout(() => setShowUpgradeHint(false), 2800)
      return
    }
    navigate(`/agents/${agent.slug}`)
  }

  return (
    <div
      className="group relative bg-white rounded-2xl p-6 overflow-hidden transition-all duration-300"
      style={{
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        cursor: locked ? 'default' : 'pointer',
        opacity: locked ? 0.72 : 1,
      }}
      onClick={handleClick}
      onMouseEnter={e => {
        if (locked) return
        const el = e.currentTarget
        el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)'
        el.style.borderColor = 'rgba(212,168,67,0.3)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        if (locked) return
        const el = e.currentTarget
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
        el.style.borderColor = 'rgba(0,0,0,0.07)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Top gold accent line (only on hover for unlocked) */}
      {!locked && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to right, transparent, #d4a843, transparent)' }}
        />
      )}

      {/* Lock badge */}
      {locked && (
        <div
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <Lock size={12} style={{ color: '#9ca3af' }} />
        </div>
      )}

      {/* Upgrade hint tooltip */}
      {showUpgradeHint && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl z-10 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(2px)' }}
        >
          <div className="text-center px-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: '#faf3e0' }}
            >
              <Lock size={16} style={{ color: '#d4a843' }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: '#1a1a1a' }}>
              Disponível no plano Pro
            </p>
            <p className="text-xs font-light" style={{ color: '#9ca3af' }}>
              Faça upgrade para acessar este agente
            </p>
            <button
              className="mt-4 text-xs font-medium px-4 py-1.5 rounded-lg transition-all duration-150"
              style={{ background: '#1a1a1a', color: '#ffffff' }}
              onClick={e => {
                e.stopPropagation()
                navigate('/plans')
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4a843' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a' }}
            >
              Ver planos
            </button>
          </div>
        </div>
      )}

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
        style={{
          backgroundColor: locked ? '#f9fafb' : '#faf3e0',
          border: `1px solid ${locked ? 'rgba(0,0,0,0.06)' : '#f3e4b8'}`,
        }}
      >
        <Icon size={20} style={{ color: locked ? '#d1d5db' : '#b8902a' }} />
      </div>

      {/* Content */}
      <div className="mb-5">
        <h3
          className="font-semibold text-base mb-1 transition-colors duration-200"
          style={{ color: locked ? '#9ca3af' : '#1a1a1a', letterSpacing: '-0.01em' }}
        >
          {agent.name}
        </h3>
        <p
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: locked ? '#d1d5db' : '#d4a843', letterSpacing: '0.08em' }}
        >
          {agent.specialty}
        </p>
        <p className="text-sm font-light leading-relaxed" style={{ color: locked ? '#c4c4c4' : '#6b7280' }}>
          {agent.description}
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between">
        {locked ? (
          <div
            className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg"
            style={{ background: '#f3f4f6', color: '#9ca3af' }}
          >
            <Lock size={11} />
            Disponível no Pro
          </div>
        ) : (
          <button
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
            style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d4a843' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1a1a1a' }}
          >
            Acessar
            <ArrowRight size={14} />
          </button>
        )}

        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: locked ? '#e5e7eb' : '#d4a843', opacity: locked ? 1 : 0.4 }}
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Bot({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  )
}

export default AgentCard
