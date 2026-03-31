import React from 'react'
import { Check, Zap, Shield, Star, Clock } from 'lucide-react'
import { useSubscription } from '@/features/subscription/SubscriptionContext'
import { PLANS, PLAN_ORDER } from '@/features/subscription/plans'
import type { PlanType } from '@/types/subscription'

// ─────────────────────────────────────────────────────────────────────────────
// Plan card icons
// ─────────────────────────────────────────────────────────────────────────────

const PLAN_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  free: Zap,
  trial: Star,
  pro: Star,
  premium: Shield,
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function planLabel(current: PlanType, target: PlanType, isTrialActive: boolean): string {
  if (current === target) return 'Plano atual'
  // When user is trialing, the Pro card becomes the upgrade target
  if (current === 'trial' && target === 'pro') return 'Assinar Pro'
  if (current === 'trial' && target === 'premium') return 'Assinar Premium'
  if (current === 'trial' && target === 'free') return 'Fazer downgrade'
  // When free and Pro is available, highlight trial offer
  if (current === 'free' && target === 'pro' && !isTrialActive) return 'Começar teste grátis'
  const order: PlanType[] = ['free', 'trial', 'pro', 'premium']
  if (order.indexOf(target) > order.indexOf(current)) {
    return target === 'pro' ? 'Assinar Pro' : 'Assinar Premium'
  }
  return 'Fazer downgrade'
}

// ─────────────────────────────────────────────────────────────────────────────
// Plan Card
// ─────────────────────────────────────────────────────────────────────────────

interface PlanCardProps {
  planId: PlanType
  currentPlan: PlanType
  onSelect: (plan: PlanType) => void
  isTrialActive: boolean
  isTrialExpired: boolean
  trialDaysRemaining: number | undefined
}

const PlanCard: React.FC<PlanCardProps> = ({
  planId,
  currentPlan,
  onSelect,
  isTrialActive,
  isTrialExpired,
  trialDaysRemaining,
}) => {
  const plan = PLANS[planId]
  const isCurrent = currentPlan === planId
  // When trialing, the Pro card acts as the "active" plan card
  const isCurrentTrial = currentPlan === 'trial' && planId === 'pro'
  const isPro = planId === 'pro'
  const isPremium = planId === 'premium'
  const Icon = PLAN_ICONS[planId]

  const buttonLabel = planLabel(currentPlan, planId, isTrialActive)
  const orderMap: Record<string, number> = { free: 0, trial: 1, pro: 2, premium: 3 }
  const isUpgrade = (orderMap[planId] ?? 0) > (orderMap[currentPlan] ?? 0)

  // ── Visual variants ──────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = isPremium
    ? {
        background: '#0f0f0f',
        border: '1px solid rgba(212,168,67,0.25)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }
    : isPro
    ? {
        background: '#ffffff',
        border: '1.5px solid rgba(212,168,67,0.45)',
        boxShadow: '0 8px 32px rgba(212,168,67,0.1), 0 2px 8px rgba(0,0,0,0.06)',
      }
    : {
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }

  const nameColor = isPremium ? '#e8ce85' : '#1a1a1a'
  const descColor = isPremium ? 'rgba(255,255,255,0.45)' : '#9ca3af'
  const priceColor = isPremium ? '#ffffff' : '#1a1a1a'
  const listItemColor = isPremium ? 'rgba(255,255,255,0.75)' : '#4b5563'
  const checkColor = isPremium ? '#d4a843' : '#b8902a'
  const dividerColor = isPremium ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'

  const iconBg = isPremium
    ? 'rgba(212,168,67,0.12)'
    : 'rgba(212,168,67,0.08)'
  const iconColor = '#d4a843'

  return (
    <div
      className="relative flex flex-col rounded-2xl p-7 transition-all duration-300"
      style={cardStyle}
    >
      {/* Popular badge */}
      {isPro && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #d4a843, #b8902a)',
            color: '#ffffff',
            boxShadow: '0 2px 12px rgba(212,168,67,0.35)',
            letterSpacing: '0.05em',
          }}
        >
          Mais popular
        </div>
      )}

      {/* Current plan badge */}
      {isCurrent && !isCurrentTrial && (
        <div
          className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: isPremium ? 'rgba(212,168,67,0.15)' : '#faf3e0',
            color: isPremium ? '#d4a843' : '#92650a',
            border: `1px solid ${isPremium ? 'rgba(212,168,67,0.3)' : '#f3e4b8'}`,
          }}
        >
          Atual
        </div>
      )}

      {/* Trial active badge — shown on Pro card when user is trialing */}
      {isCurrentTrial && (
        <div
          className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: (isTrialExpired) ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.15)',
            color: '#92650a',
            border: '1px solid rgba(212,168,67,0.3)',
          }}
        >
          <Clock size={10} style={{ color: '#d4a843' }} />
          {isTrialExpired
            ? 'Trial encerrado'
            : `Trial · ${trialDaysRemaining}d`}
        </div>
      )}

      {/* Icon + Name */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <h3
            className="font-semibold text-base leading-none mb-1"
            style={{ color: nameColor, letterSpacing: '-0.01em' }}
          >
            {plan.name}
          </h3>
          <p className="text-xs font-light" style={{ color: descColor }}>
            {plan.description}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        {plan.price === 0 ? (
          <span className="text-3xl font-semibold" style={{ color: priceColor, letterSpacing: '-0.03em' }}>
            Grátis
          </span>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-medium" style={{ color: descColor }}>R$</span>
              <span className="text-4xl font-semibold" style={{ color: priceColor, letterSpacing: '-0.04em' }}>
                {plan.price}
              </span>
              <span className="text-sm font-light" style={{ color: descColor }}>/mês</span>
            </div>
            {/* Free trial callout — only on Pro card and when user is not already trialing/pro */}
            {isPro && currentPlan === 'free' && (
              <p className="text-xs font-medium mt-1" style={{ color: '#d4a843' }}>
                7 dias grátis para testar
              </p>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mb-5" style={{ height: '1px', background: dividerColor }} />

      {/* Feature list */}
      <ul className="space-y-3 flex-1 mb-7">
        {plan.highlights.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check
              size={14}
              className="mt-0.5 flex-shrink-0"
              style={{ color: checkColor }}
            />
            <span className="text-sm font-light leading-snug" style={{ color: listItemColor }}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(planId)}
        disabled={isCurrent && !isCurrentTrial}
        className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
        style={
          isCurrent && !isCurrentTrial
            ? {
                background: isPremium ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
                color: isPremium ? 'rgba(255,255,255,0.35)' : '#9ca3af',
                cursor: 'default',
              }
            : isPremium
            ? {
                background: 'linear-gradient(135deg, #d4a843, #b8902a)',
                color: '#ffffff',
                boxShadow: '0 2px 12px rgba(212,168,67,0.3)',
              }
            : isPro || isUpgrade || isCurrentTrial
            ? {
                background: '#1a1a1a',
                color: '#ffffff',
              }
            : {
                background: '#f3f4f6',
                color: '#6b7280',
              }
        }
        onMouseEnter={e => {
          if (isCurrent && !isCurrentTrial) return
          if (isPremium) {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,168,67,0.45)'
          } else if (isPro || isUpgrade || isCurrentTrial) {
            e.currentTarget.style.background = '#d4a843'
            e.currentTarget.style.color = '#ffffff'
          }
        }}
        onMouseLeave={e => {
          if (isCurrent && !isCurrentTrial) return
          if (isPremium) {
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(212,168,67,0.3)'
          } else if (isPro || isUpgrade || isCurrentTrial) {
            e.currentTarget.style.background = '#1a1a1a'
            e.currentTarget.style.color = '#ffffff'
          }
        }}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Plans Page
// ─────────────────────────────────────────────────────────────────────────────

const PlansPage: React.FC = () => {
  const { subscription, devSetPlan, devSetTrial, isTrialActive, isTrialExpired, trialDaysRemaining } = useSubscription()
  const currentPlan = subscription.plan

  const handleSelect = (plan: PlanType) => {
    if (plan === currentPlan) return
    // TODO: connect to payment gateway
    // For now: activate trial when free user clicks Pro, otherwise update mock plan
    if (currentPlan === 'free' && plan === 'pro') {
      devSetTrial(false)
      return
    }
    devSetPlan(plan)
  }

  return (
    <div
      className="min-h-full px-6 py-10 md:px-10 md:py-14"
      style={{ backgroundColor: '#f8f7f5', fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Page header */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d4a843' }} />
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: '#9ca3af', letterSpacing: '0.12em' }}
          >
            Planos &amp; Assinatura
          </span>
        </div>

        <h1
          className="text-3xl md:text-4xl font-semibold mb-4"
          style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}
        >
          Escolha seu plano
        </h1>

        <p className="text-sm md:text-base font-light leading-relaxed" style={{ color: '#6b7280' }}>
          Raciocínio clínico de alto nível para cada etapa da sua prática.
          <br className="hidden md:block" />
          Cancele a qualquer momento.
        </p>
      </div>

      {/* Gold divider */}
      <div
        className="max-w-xs mx-auto mb-12"
        style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e8ce85, transparent)' }}
      />

      {/* Plan cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-start">
        {PLAN_ORDER.map((planId) => (
          <div key={planId} className={planId === 'pro' ? 'md:mt-[-16px]' : ''}>
            <PlanCard
              planId={planId}
              currentPlan={currentPlan}
              onSelect={handleSelect}
              isTrialActive={isTrialActive}
              isTrialExpired={isTrialExpired}
              trialDaysRemaining={trialDaysRemaining}
            />
          </div>
        ))}
      </div>

      {/* Fine print */}
      <p className="text-center mt-10 text-xs font-light" style={{ color: '#b0b0b0' }}>
        Cobrança mensal. Sem fidelidade. Cancele quando quiser.
      </p>

      {/* Dev switcher — visible only in development */}
      {import.meta.env.DEV && (
        <div
          className="fixed bottom-5 right-5 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium flex-wrap max-w-sm"
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ color: '#9ca3af' }}>Dev:</span>
          {(['free', 'pro', 'premium'] as PlanType[]).map((p) => (
            <button
              key={p}
              onClick={() => devSetPlan(p)}
              className="px-2.5 py-1 rounded-lg capitalize transition-all duration-150"
              style={{
                background: currentPlan === p && !isTrialActive && !isTrialExpired ? '#1a1a1a' : '#f3f4f6',
                color: currentPlan === p && !isTrialActive && !isTrialExpired ? '#ffffff' : '#6b7280',
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => devSetTrial(false)}
            className="px-2.5 py-1 rounded-lg transition-all duration-150"
            style={{
              background: isTrialActive ? '#d4a843' : '#f3f4f6',
              color: isTrialActive ? '#ffffff' : '#6b7280',
            }}
          >
            trial
          </button>
          <button
            onClick={() => devSetTrial(true)}
            className="px-2.5 py-1 rounded-lg transition-all duration-150"
            style={{
              background: isTrialExpired ? '#d4a843' : '#f3f4f6',
              color: isTrialExpired ? '#ffffff' : '#6b7280',
            }}
          >
            trial✕
          </button>
        </div>
      )}
    </div>
  )
}

export default PlansPage
