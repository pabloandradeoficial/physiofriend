import type { PlanConfig } from '@/types/subscription'

// Agent slugs that exist in the app
const ALL_AGENT_SLUGS = ['orthopedics', 'neurology', 'geriatrics', 'hospital', 'homecare']

export const PLANS: Record<string, PlanConfig> = {
  // Trial uses Pro-level features — serves as the conversion bridge
  trial: {
    id: 'trial',
    name: 'Trial',
    price: 0,
    priceLabel: 'Grátis por 7 dias',
    description: 'Acesso completo ao plano Pro.',
    features: {
      monthlyMessageLimit: 200,
      allowedAgentSlugs: 'all',
      historyDays: -1,
      canSaveCases: true,
      advancedResponses: true,
      prioritySupport: false,
      futureFeatures: false,
    },
    highlights: [
      `${ALL_AGENT_SLUGS.length} agentes especialistas`,
      '200 perguntas por mês',
      'Histórico ilimitado',
      'Salvar casos clínicos',
      'Respostas mais completas',
    ],
  },

  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Grátis',
    description: 'Para conhecer a plataforma.',
    features: {
      monthlyMessageLimit: 20,
      allowedAgentSlugs: ['orthopedics'],
      historyDays: 7,
      canSaveCases: false,
      advancedResponses: false,
      prioritySupport: false,
      futureFeatures: false,
    },
    highlights: [
      '1 agente especialista',
      '20 perguntas por mês',
      'Histórico de 7 dias',
      'Acesso básico à plataforma',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    priceLabel: 'R$ 49/mês',
    description: 'Para o fisioterapeuta ativo.',
    badge: 'Mais popular',
    features: {
      monthlyMessageLimit: 200,
      allowedAgentSlugs: 'all',
      historyDays: -1,
      canSaveCases: true,
      advancedResponses: true,
      prioritySupport: false,
      futureFeatures: false,
    },
    highlights: [
      `${ALL_AGENT_SLUGS.length} agentes especialistas`,
      '200 perguntas por mês',
      'Histórico ilimitado',
      'Salvar casos clínicos',
      'Respostas mais completas',
    ],
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    price: 99,
    priceLabel: 'R$ 99/mês',
    description: 'Para máxima performance clínica.',
    features: {
      monthlyMessageLimit: -1,
      allowedAgentSlugs: 'all',
      historyDays: -1,
      canSaveCases: true,
      advancedResponses: true,
      prioritySupport: true,
      futureFeatures: true,
    },
    highlights: [
      `${ALL_AGENT_SLUGS.length} agentes especialistas`,
      'Perguntas ilimitadas',
      'Histórico ilimitado',
      'Salvar casos clínicos',
      'Respostas avançadas',
      'Suporte prioritário',
      'Acesso antecipado a novidades',
    ],
  },
}

export const PLAN_ORDER: Array<PlanConfig['id']> = ['free', 'pro', 'premium']

export const getPlan = (id: string): PlanConfig => PLANS[id] ?? PLANS.free
