import type { Agent } from '@/types'

export const AGENTS: Agent[] = [
  {
    id: '1',
    slug: 'orthopedics',
    name: 'Agente de Ortopedia',
    specialty: 'Fisioterapia Musculoesquelética',
    description: 'Apoio ao raciocínio clínico musculoesquelético',
    long_description:
      'Suporte especializado para avaliação, diagnóstico cinético-funcional e elaboração de condutas em condições musculoesqueléticas. Ideal para lesões articulares, disfunções posturais e reabilitação pós-cirúrgica.',
    icon: 'Bone',
    color: '#b8902a',
    suggestions: [
      'Protocolo pós-operatório LCA',
      'Avaliação da coluna lombar',
      'Síndrome do manguito rotador',
      'Osteoartrite de joelho',
    ],
  },
  {
    id: '2',
    slug: 'neurology',
    name: 'Agente de Neurologia',
    specialty: 'Fisioterapia Neurofuncional',
    description: 'Suporte para análise funcional e conduta neurofuncional',
    long_description:
      'Apoio clínico para avaliação e reabilitação neurológica. Abrange condições como AVC, doença de Parkinson, esclerose múltipla, lesão medular e distúrbios do equilíbrio de origem central.',
    icon: 'Brain',
    color: '#7a5c18',
    suggestions: [
      'Reabilitação pós-AVC',
      'Avaliação motora de Parkinson',
      'Marcha patológica',
      'Controle de tronco e equilíbrio',
    ],
  },
  {
    id: '3',
    slug: 'geriatrics',
    name: 'Agente de Geriatria',
    specialty: 'Fisioterapia Geriátrica',
    description: 'Apoio para funcionalidade, equilíbrio e envelhecimento',
    long_description:
      'Suporte voltado ao paciente idoso, com foco em prevenção de quedas, manutenção da capacidade funcional, fragilidade, sarcopenia e manejo das condições associadas ao envelhecimento.',
    icon: 'HeartHandshake',
    color: '#9a7520',
    suggestions: [
      'Avaliação de risco de quedas',
      'Protocolo de fragilidade',
      'Reabilitação da fratura de fêmur',
      'Capacidade funcional no idoso',
    ],
  },
  {
    id: '4',
    slug: 'hospital',
    name: 'Agente Hospitalar',
    specialty: 'Fisioterapia Hospitalar',
    description: 'Suporte em contextos clínicos hospitalares',
    long_description:
      'Apoio ao raciocínio clínico no ambiente hospitalar, incluindo UTI, enfermaria e pós-operatório imediato. Abrange desmame ventilatório, mobilização precoce e prevenção de complicações.',
    icon: 'Activity',
    color: '#b8902a',
    suggestions: [
      'Desmame ventilatório',
      'Mobilização precoce em UTI',
      'Fisioterapia pós-cirurgia cardíaca',
      'Prevenção de TEV',
    ],
  },
  {
    id: '5',
    slug: 'homecare',
    name: 'Agente Domiciliar',
    specialty: 'Fisioterapia Home Care',
    description: 'Suporte para condutas no atendimento home care',
    long_description:
      'Suporte para o fisioterapeuta que atua em ambiente domiciliar, com orientações sobre adaptação de condutas, uso de recursos limitados, segurança do paciente e comunicação com cuidadores.',
    icon: 'Home',
    color: '#9a7520',
    suggestions: [
      'Adaptação de exercícios para casa',
      'Orientação a cuidadores',
      'Avaliação domiciliar',
      'Segurança e prevenção de quedas',
    ],
  },
]

export const getAgentBySlug = (slug: string): Agent | undefined =>
  AGENTS.find((a) => a.slug === slug)
