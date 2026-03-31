import React from 'react'
import { MessageSquare, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '@/features/subscription/SubscriptionContext'

const HistoryPage: React.FC = () => {
  const { subscription } = useSubscription()
  const navigate = useNavigate()
  const isFree = subscription.plan === 'free'

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d4a843' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#9ca3af', letterSpacing: '0.12em' }}>
            Registro clínico
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-semibold mb-2"
          style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
        >
          Histórico de Conversas
        </h1>
        <p className="text-sm font-light" style={{ color: '#9ca3af' }}>
          Todas as suas interações clínicas em um só lugar.
        </p>
      </div>

      <div
        className="mb-8"
        style={{ height: '1px', background: 'linear-gradient(to right, #e8ce85, transparent)' }}
      />

      {/* Free plan notice */}
      {isFree && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl mb-8 flex-wrap gap-y-3"
          style={{ backgroundColor: '#fdfaf3', border: '1px solid #f3e4b8' }}
        >
          <div className="flex items-center gap-3">
            <Clock size={15} style={{ color: '#b8902a', flexShrink: 0 }} />
            <p className="text-sm font-light" style={{ color: '#92650a' }}>
              Plano Free: histórico limitado a <span className="font-medium">7 dias</span>.
            </p>
          </div>
          <button
            onClick={() => navigate('/plans')}
            className="text-xs font-medium transition-colors duration-150 flex-shrink-0"
            style={{ color: '#b8902a' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#d4a843' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#b8902a' }}
          >
            Fazer upgrade →
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: '#faf3e0', border: '1px solid #f3e4b8' }}
        >
          <MessageSquare size={24} style={{ color: '#b8902a' }} />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>
          Nenhuma conversa ainda
        </h2>
        <p className="text-sm font-light" style={{ color: '#9ca3af' }}>
          Inicie uma conversa com um agente para que ela apareça aqui.
        </p>
      </div>
    </div>
  )
}

export default HistoryPage
