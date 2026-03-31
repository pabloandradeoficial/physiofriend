import React from 'react'
import { MessageSquare } from 'lucide-react'

const HistoryPage: React.FC = () => {
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
