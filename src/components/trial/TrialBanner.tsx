import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, X, ArrowRight, AlertCircle } from 'lucide-react'
import { useSubscription } from '@/features/subscription/SubscriptionContext'

// ─────────────────────────────────────────────────────────────────────────────
// TrialBanner
// Shows a contextual, dismissible banner for trial-active and trial-expired.
// Designed to be non-invasive: premium aesthetics, no popup aggression.
// ─────────────────────────────────────────────────────────────────────────────

const TrialBanner: React.FC = () => {
  const { isTrialActive, isTrialExpired, trialDaysRemaining } = useSubscription()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  // Only renders for trial states
  if ((!isTrialActive && !isTrialExpired) || dismissed) return null

  if (isTrialExpired) {
    return (
      <div
        className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl mb-8"
        style={{
          background: 'linear-gradient(135deg, #fdf4e7, #fef9f0)',
          border: '1px solid rgba(212,168,67,0.3)',
          boxShadow: '0 2px 12px rgba(212,168,67,0.08)',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(212,168,67,0.12)' }}
          >
            <AlertCircle size={15} style={{ color: '#d4a843' }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium" style={{ color: '#7a5c18' }}>
              Seu período de teste encerrou
            </p>
            <p className="text-xs font-light" style={{ color: '#9ca3af' }}>
              Continue com acesso completo ao PhysioFriend Pro.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/plans')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #d4a843, #b8902a)',
              color: '#ffffff',
              boxShadow: '0 2px 10px rgba(212,168,67,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,168,67,0.45)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(212,168,67,0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Fazer upgrade
            <ArrowRight size={12} />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg transition-colors duration-150"
            style={{ color: '#c4a87a' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,168,67,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )
  }

  // ── Trial active ──────────────────────────────────────────────────────────

  const isLastDays = typeof trialDaysRemaining === 'number' && trialDaysRemaining <= 2
  const dayLabel =
    trialDaysRemaining === 0
      ? 'expira hoje'
      : trialDaysRemaining === 1
      ? 'expira amanhã'
      : `${trialDaysRemaining} dias restantes`

  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl mb-8"
      style={{
        background: isLastDays
          ? 'linear-gradient(135deg, #fdf4e7, #fef3e2)'
          : 'linear-gradient(135deg, #fafaf8, #fdf9f2)',
        border: `1px solid ${isLastDays ? 'rgba(212,168,67,0.4)' : 'rgba(212,168,67,0.2)'}`,
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}
        >
          <Clock size={14} style={{ color: '#d4a843' }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
            {isLastDays
              ? 'Últimos dias do seu teste grátis'
              : 'Você está no teste grátis do Pro'}
          </p>
          <p className="text-xs font-light" style={{ color: '#9ca3af' }}>
            Acesso completo ativo ·{' '}
            <span style={{ color: isLastDays ? '#d4a843' : '#b0a07a', fontWeight: 500 }}>
              {dayLabel}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => navigate('/plans')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            background: '#1a1a1a',
            color: '#ffffff',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#d4a843'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#1a1a1a'
          }}
        >
          Ver planos
          <ArrowRight size={12} />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg transition-colors duration-150"
          style={{ color: '#c4c4c4' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default TrialBanner
