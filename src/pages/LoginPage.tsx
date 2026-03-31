import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

const LoginPage: React.FC = () => {
  const { user, loading, signInWithGoogle } = useAuth()

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f8f7f5' }}
    >
      {/* Left Panel — Decorative */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1a1a1a 0%, #2d2417 60%, #1a1a1a 100%)',
        }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #d4a843 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Gold accent line */}
        <div
          className="absolute top-0 left-0 w-full h-0.5"
          style={{ background: 'linear-gradient(to right, transparent, #d4a843, transparent)' }}
        />

        {/* Top content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(212, 168, 67, 0.15)', border: '1px solid rgba(212, 168, 67, 0.3)' }}
            >
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#d4a843' }} />
            </div>
            <span className="text-white font-semibold tracking-tight">
              Physio<span style={{ color: '#d4a843' }}>Friend</span>
            </span>
          </div>

          <div>
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6 tracking-wide uppercase"
              style={{
                backgroundColor: 'rgba(212, 168, 67, 0.12)',
                color: '#d4a843',
                border: '1px solid rgba(212, 168, 67, 0.25)',
                letterSpacing: '0.1em',
              }}
            >
              Plataforma Premium
            </div>
            <h2
              className="text-3xl font-light leading-snug text-white mb-6"
              style={{ letterSpacing: '-0.01em' }}
            >
              Inteligência clínica
              <br />
              <span style={{ color: '#d4a843', fontWeight: 500 }}>ao seu alcance.</span>
            </h2>
            <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Agentes especializados que apoiam seu raciocínio clínico em fisioterapia,
              com a precisão e discrição que sua prática exige.
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-4">
          {[
            'Agentes por especialidade',
            'Raciocínio clínico assistido',
            'Histórico de casos seguro',
            'Atualização contínua',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: '1px solid rgba(212,168,67,0.4)', backgroundColor: 'rgba(212,168,67,0.08)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d4a843' }} />
              </div>
              <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom gold line */}
        <div
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{ background: 'linear-gradient(to right, transparent, #d4a843, transparent)' }}
        />
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <span
              className="text-2xl font-semibold tracking-tight"
              style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
            >
              Physio<span style={{ color: '#d4a843' }}>Friend</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
            >
              Bem-vindo de volta
            </h1>
            <p className="text-sm font-light leading-relaxed" style={{ color: '#9ca3af' }}>
              Seu copiloto inteligente para raciocínio clínico em fisioterapia
            </p>
          </div>

          {/* Gold divider */}
          <div
            className="mb-10"
            style={{
              height: '1px',
              background: 'linear-gradient(to right, #e8ce85, transparent)',
            }}
          />

          {/* Google Sign In */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl font-medium text-sm transition-all duration-200 group"
            style={{
              backgroundColor: '#ffffff',
              color: '#1a1a1a',
              border: '1.5px solid rgba(0,0,0,0.1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#d4a843'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(212,168,67,0.15), 0 1px 3px rgba(0,0,0,0.06)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)'
            }}
          >
            {/* Google Icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.9582H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4523 0.347727 11.8269 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9255L15.0218 2.3441C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9582L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335"/>
            </svg>
            <span>Entrar com Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} />
            <span className="text-xs font-light" style={{ color: '#c4c4c4' }}>acesso seguro</span>
            <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} />
          </div>

          {/* Security note */}
          <p className="text-xs font-light text-center leading-relaxed" style={{ color: '#b0b0b0' }}>
            Seus dados clínicos são protegidos com criptografia de ponta a ponta.
            A plataforma segue as diretrizes da LGPD.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center gap-6">
          {['Termos de Uso', 'Privacidade', 'Suporte'].map((link, i) => (
            <React.Fragment key={link}>
              <a
                href="#"
                className="text-xs font-light transition-colors duration-150"
                style={{ color: '#c4c4c4' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#d4a843' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#c4c4c4' }}
              >
                {link}
              </a>
              {i < 2 && (
                <div className="w-px h-3" style={{ backgroundColor: 'rgba(0,0,0,0.12)' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
