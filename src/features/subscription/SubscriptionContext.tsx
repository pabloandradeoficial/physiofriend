import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { PlanType, UserSubscription } from '@/types/subscription'
import { getPlan } from './plans'

// ─────────────────────────────────────────────────────────────────────────────
// Dev mock helpers — swap plan/trial state for UI testing.
// In production this state will come from the backend / Stripe webhook.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pf_dev_mock_plan'

type MockValue = PlanType | 'trial-expired'

function readMockValue(): MockValue {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (
      stored === 'free' ||
      stored === 'trial' ||
      stored === 'trial-expired' ||
      stored === 'pro' ||
      stored === 'premium'
    )
      return stored as MockValue
  } catch {}
  return 'free'
}

function buildSubscription(mock: MockValue): UserSubscription {
  const now = Date.now()
  const DAY = 24 * 60 * 60 * 1000

  if (mock === 'trial') {
    return {
      plan: 'trial',
      status: 'trialing',
      trialEndsAt: new Date(now + 5 * DAY).toISOString(), // 5 days remaining for demo
    }
  }
  if (mock === 'trial-expired') {
    return {
      plan: 'trial',
      status: 'expired',
      trialEndsAt: new Date(now - 2 * DAY).toISOString(), // expired 2 days ago
    }
  }
  return { plan: mock, status: 'active' }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────────────────────────────────────

interface SubscriptionContextType {
  subscription: UserSubscription

  /** Returns true when the agent with the given slug is accessible on the current plan */
  canAccessAgent: (slug: string) => boolean

  /** Returns true when the user still has messages remaining this month */
  canSendMessage: () => boolean

  /** Returns true if a named feature is enabled for the current plan */
  hasFeature: (feature: keyof ReturnType<typeof getPlan>['features']) => boolean

  /** Messages remaining this period (undefined = unlimited) */
  messagesRemaining: number | undefined

  // ── Trial computed state ──────────────────────────────────────────────────
  /** True when the user is actively in a trial period */
  isTrialActive: boolean
  /** True when the trial has ended and the user has not upgraded */
  isTrialExpired: boolean
  /** Days remaining in trial (undefined when not in trial) */
  trialDaysRemaining: number | undefined

  // ── Dev helpers (removed in prod integration) ─────────────────────────────
  /** Switch mock plan — for UI testing only */
  devSetPlan: (plan: PlanType) => void
  /** Activate trial mock — pass true to simulate expired state */
  devSetTrial: (expired?: boolean) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Context + Provider
// ─────────────────────────────────────────────────────────────────────────────

const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<UserSubscription>(() =>
    buildSubscription(readMockValue())
  )

  // When on trial (active or expired) use the trial plan config (Pro-level features).
  // This ensures feature access is computed correctly for both states.
  const planConfig = getPlan(subscription.plan)

  // ── Trial computed values ──────────────────────────────────────────────────

  const { isTrialActive, isTrialExpired, trialDaysRemaining } = useMemo(() => {
    if (subscription.plan !== 'trial') {
      return { isTrialActive: false, isTrialExpired: false, trialDaysRemaining: undefined }
    }

    const now = Date.now()
    const endsAt = subscription.trialEndsAt ? new Date(subscription.trialEndsAt).getTime() : 0
    const msRemaining = endsAt - now
    const daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)))
    const expired = subscription.status === 'expired' || msRemaining <= 0

    return {
      isTrialActive: !expired,
      isTrialExpired: expired,
      trialDaysRemaining: expired ? 0 : daysRemaining,
    }
  }, [subscription])

  // ── Feature access ────────────────────────────────────────────────────────
  // When trial has expired, downgrade access to Free-level features.

  const effectivePlanConfig = useMemo(() => {
    if (isTrialExpired) return getPlan('free')
    return planConfig
  }, [planConfig, isTrialExpired])

  const canAccessAgent = useCallback(
    (slug: string) => {
      const allowed = effectivePlanConfig.features.allowedAgentSlugs
      if (allowed === 'all') return true
      return allowed.includes(slug)
    },
    [effectivePlanConfig]
  )

  const canSendMessage = useCallback(() => {
    const limit = effectivePlanConfig.features.monthlyMessageLimit
    if (limit === -1) return true
    // TODO: fetch real usage from backend
    return true
  }, [effectivePlanConfig])

  const hasFeature = useCallback(
    (feature: keyof ReturnType<typeof getPlan>['features']) => {
      return Boolean(effectivePlanConfig.features[feature])
    },
    [effectivePlanConfig]
  )

  const messagesRemaining =
    effectivePlanConfig.features.monthlyMessageLimit === -1
      ? undefined
      : effectivePlanConfig.features.monthlyMessageLimit

  // ── Dev helpers ───────────────────────────────────────────────────────────

  const devSetPlan = useCallback((plan: PlanType) => {
    try { localStorage.setItem(STORAGE_KEY, plan) } catch {}
    setSubscription(buildSubscription(plan))
  }, [])

  const devSetTrial = useCallback((expired = false) => {
    const mock: MockValue = expired ? 'trial-expired' : 'trial'
    try { localStorage.setItem(STORAGE_KEY, mock) } catch {}
    setSubscription(buildSubscription(mock))
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        canAccessAgent,
        canSendMessage,
        hasFeature,
        messagesRemaining,
        isTrialActive,
        isTrialExpired,
        trialDaysRemaining,
        devSetPlan,
        devSetTrial,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription(): SubscriptionContextType {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used inside <SubscriptionProvider>')
  return ctx
}
