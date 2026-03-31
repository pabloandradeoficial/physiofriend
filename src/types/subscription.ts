// ─────────────────────────────────────────────────────────────────────────────
// Subscription types — designed for future Stripe / gateway integration
// ─────────────────────────────────────────────────────────────────────────────

export type PlanType = 'free' | 'trial' | 'pro' | 'premium'

export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'expired'

export interface PlanFeatures {
  /** Max messages per month. -1 = unlimited */
  monthlyMessageLimit: number
  /** Agent slugs allowed. 'all' = unrestricted */
  allowedAgentSlugs: string[] | 'all'
  /** Days of history retained. -1 = unlimited */
  historyDays: number
  /** Whether cases can be saved */
  canSaveCases: boolean
  /** Access to richer, longer AI responses */
  advancedResponses: boolean
  /** Priority support queue */
  prioritySupport: boolean
  /** Access to future / beta features as they launch */
  futureFeatures: boolean
}

export interface PlanConfig {
  id: PlanType
  name: string
  /** Monthly price in BRL (0 for free) */
  price: number
  priceLabel: string
  description: string
  /** Sidebar/card badge text, e.g. "Mais popular" */
  badge?: string
  features: PlanFeatures
  /** Marketing bullet points shown on the plans page */
  highlights: string[]
}

/**
 * Represents the authenticated user's current subscription state.
 * Fields prefixed with `external` are reserved for future gateway integration.
 */
export interface UserSubscription {
  plan: PlanType
  status: SubscriptionStatus
  trialEndsAt?: string          // ISO date string
  currentPeriodEnd?: string     // ISO date string
  // ── Future gateway fields ──────────────────────────────
  externalCustomerId?: string   // e.g. Stripe customer ID
  externalSubscriptionId?: string
  cancelAtPeriodEnd?: boolean
}
