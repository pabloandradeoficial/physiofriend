import React from 'react'
import { Settings, User, Bell, Shield, CreditCard } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'

const SECTIONS = [
  { icon: User, label: 'Perfil', desc: 'Nome, foto e informações profissionais' },
  { icon: Bell, label: 'Notificações', desc: 'Preferências de alertas e avisos' },
  { icon: Shield, label: 'Privacidade e Segurança', desc: 'Dados, LGPD e controle de acesso' },
  { icon: CreditCard, label: 'Plano', desc: 'Assinatura e recursos disponíveis' },
]

const SettingsPage: React.FC = () => {
  const { user } = useAuth()
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Fisioterapeuta'
  const avatarUrl = user?.user_metadata?.avatar_url
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d4a843' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#9ca3af', letterSpacing: '0.12em' }}>
            Preferências
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-semibold mb-2"
          style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
        >
          Configurações
        </h1>
        <p className="text-sm font-light" style={{ color: '#9ca3af' }}>
          Gerencie sua conta e preferências da plataforma.
        </p>
      </div>

      <div
        className="mb-8"
        style={{ height: '1px', background: 'linear-gradient(to right, #e8ce85, transparent)' }}
      />

      {/* Profile card */}
      <div
        className="bg-white rounded-2xl p-6 mb-6"
        style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-14 h-14 rounded-2xl object-cover"
              style={{ border: '2px solid #f3e4b8' }}
            />
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-semibold"
              style={{ background: 'linear-gradient(135deg, #f3e4b8, #e8ce85)', color: '#7a5c18' }}
            >
              {initials}
            </div>
          )}
          <div>
            <p className="font-semibold text-base" style={{ color: '#1a1a1a' }}>{displayName}</p>
            <p className="text-sm font-light" style={{ color: '#9ca3af' }}>{user?.email}</p>
            <div
              className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#fefce8', color: '#92650a', border: '1px solid #f3e4b8' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d4a843' }} />
              Conta Beta
            </div>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="space-y-2">
        {SECTIONS.map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
            className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl text-left transition-all duration-150"
            style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#faf3e0' }}
            >
              <Icon size={16} style={{ color: '#b8902a' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{label}</p>
              <p className="text-xs font-light" style={{ color: '#9ca3af' }}>{desc}</p>
            </div>
            <Settings size={14} style={{ color: '#d1d5db' }} />
          </button>
        ))}
      </div>

      <p
        className="text-xs font-light text-center mt-10"
        style={{ color: '#d1d5db' }}
      >
        PhysioFriend · Beta · v0.1.0
      </p>
    </div>
  )
}

export default SettingsPage
