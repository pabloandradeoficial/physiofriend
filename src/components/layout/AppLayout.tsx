import React, { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  BookmarkCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useSubscription } from '@/features/subscription/SubscriptionContext'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/agents', icon: Bot, label: 'Agentes' },
  { to: '/history', icon: MessageSquare, label: 'Histórico' },
  { to: '/saved', icon: BookmarkCheck, label: 'Casos Salvos' },
  { to: '/plans', icon: Sparkles, label: 'Planos' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
]

const PLAN_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  free:    { label: 'Free',    bg: '#f3f4f6',           color: '#6b7280' },
  trial:   { label: 'Trial',   bg: 'rgba(212,168,67,0.12)', color: '#92650a' },
  pro:     { label: 'Pro',     bg: '#faf3e0',           color: '#92650a' },
  premium: { label: 'Premium', bg: '#1a1a1a',           color: '#d4a843' },
}

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth()
  const { subscription, isTrialActive, isTrialExpired, trialDaysRemaining } = useSubscription()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const planBadge = PLAN_BADGE[subscription.plan] ?? PLAN_BADGE.free

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Fisioterapeuta'
  const avatarUrl = user?.user_metadata?.avatar_url
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f8f7f5', fontFamily: 'Montserrat, sans-serif' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 flex flex-col
          w-64 bg-white h-full
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex flex-col">
            <span
              className="font-semibold tracking-tight text-lg leading-none"
              style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
            >
              Physio
              <span style={{ color: '#d4a843' }}>Friend</span>
            </span>
            <span className="text-xs font-light mt-1" style={{ color: '#9ca3af', letterSpacing: '0.02em' }}>
              plataforma clínica
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded"
            style={{ color: '#6b7280' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#92650a' : undefined,
                  backgroundColor: isActive ? '#fefce8' : undefined,
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={17}
                      style={{ color: isActive ? '#d4a843' : undefined }}
                      className={!isActive ? 'text-gray-400 group-hover:text-gray-600' : ''}
                    />
                    <span>{label}</span>
                    {isActive && (
                      <ChevronRight size={14} className="ml-auto" style={{ color: '#d4a843', opacity: 0.6 }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Trial status block */}
        {(isTrialActive || isTrialExpired) && (
          <div className="mx-3 mb-2">
            <div
              className="px-3 py-3 rounded-xl"
              style={{
                background: isTrialExpired
                  ? 'linear-gradient(135deg, #fdf4e7, #fef9f0)'
                  : 'linear-gradient(135deg, #fafaf8, #fdf9f2)',
                border: `1px solid ${isTrialExpired ? 'rgba(212,168,67,0.35)' : 'rgba(212,168,67,0.2)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock size={12} style={{ color: '#d4a843', flexShrink: 0 }} />
                <span className="text-xs font-semibold" style={{ color: '#7a5c18' }}>
                  {isTrialExpired ? 'Trial encerrado' : 'Teste grátis ativo'}
                </span>
              </div>
              <p className="text-xs font-light mb-2.5" style={{ color: '#9ca3af', lineHeight: 1.4 }}>
                {isTrialExpired
                  ? 'Faça upgrade para manter o acesso completo.'
                  : `${trialDaysRemaining === 1 ? '1 dia restante' : `${trialDaysRemaining} dias restantes`} de acesso Pro.`}
              </p>
              <button
                onClick={() => { navigate('/plans'); setMobileOpen(false) }}
                className="w-full py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                style={{
                  background: isTrialExpired
                    ? 'linear-gradient(135deg, #d4a843, #b8902a)'
                    : '#1a1a1a',
                  color: '#ffffff',
                }}
                onMouseEnter={e => {
                  if (!isTrialExpired) e.currentTarget.style.background = '#d4a843'
                }}
                onMouseLeave={e => {
                  if (!isTrialExpired) e.currentTarget.style.background = '#1a1a1a'
                }}
              >
                {isTrialExpired ? 'Fazer upgrade' : 'Ver planos'}
              </button>
            </div>
          </div>
        )}

        {/* Gold divider */}
        <div className="mx-6" style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e8ce85, transparent)' }} />

        {/* User section */}
        <div className="px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
                style={{ border: '1.5px solid #e8ce85' }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: 'linear-gradient(135deg, #f3e4b8, #e8ce85)', color: '#7a5c18' }}
              >
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate" style={{ color: '#1a1a1a' }}>
                  {displayName}
                </p>
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
                  style={{ background: planBadge.bg, color: planBadge.color, fontSize: '10px', letterSpacing: '0.04em' }}
                >
                  {planBadge.label}
                </span>
              </div>
              <p className="text-xs truncate font-light" style={{ color: '#9ca3af' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-red-50"
            style={{ color: '#9ca3af' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#9ca3af'
            }}
          >
            <LogOut size={15} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header
          className="flex items-center justify-between px-6 py-4 bg-white flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: '#6b7280' }}
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#d4a843' }}
            />
            <span className="text-xs font-light tracking-wide uppercase" style={{ color: '#9ca3af', letterSpacing: '0.1em' }}>
              Plataforma Clínica
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#fefce8', color: '#92650a', border: '1px solid #f3e4b8' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d4a843' }} />
              Beta
            </div>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
                style={{ border: '1.5px solid #e8ce85' }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: 'linear-gradient(135deg, #f3e4b8, #e8ce85)', color: '#7a5c18' }}
              >
                {initials}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
