import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, ChevronRight } from 'lucide-react'
import { getConversations } from '@/services/conversations'
import type { Conversation } from '@/types'

const AGENT_NAMES: Record<string, string> = {
  orthopedics: 'Ortopedia',
  neurology: 'Neurologia',
  geriatrics: 'Geriatria',
  hospital: 'Hospitalar',
  homecare: 'Home Care',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConversations().then(data => {
      setConversations(data)
      setLoading(false)
    })
  }, [])

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

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ backgroundColor: '#f3f4f6' }}
            />
          ))}
        </div>
      ) : conversations.length === 0 ? (
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
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => navigate(`/agents/${conv.agent_id}`)}
              className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl transition-all duration-150"
              style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; e.currentTarget.style.backgroundColor = '#fdfaf3' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'; e.currentTarget.style.backgroundColor = '#ffffff' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#faf3e0', border: '1px solid #f3e4b8' }}
              >
                <MessageSquare size={15} style={{ color: '#b8902a' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate mb-0.5" style={{ color: '#1a1a1a' }}>
                  {conv.title}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#faf3e0', color: '#92650a' }}
                  >
                    {AGENT_NAMES[conv.agent_id] ?? conv.agent_id}
                  </span>
                  <span className="text-xs font-light" style={{ color: '#9ca3af' }}>
                    {formatDate(conv.updated_at ?? conv.created_at)}
                  </span>
                </div>
              </div>
              <ChevronRight size={15} style={{ color: '#d4a843', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage
