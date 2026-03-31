import { ORTHOPEDICS_SYSTEM_PROMPT } from './orthopedics'

// Fallback prompt for agents not yet implemented
const COMING_SOON_PROMPT = (agentName: string) => `Você é o ${agentName} do PhysioFriend.
Este agente está em desenvolvimento e será disponibilizado em breve.
Por enquanto, responda de forma gentil que este agente ainda não está disponível,
mas que o fisioterapeuta pode usar o Agente de Ortopedia que já está ativo.`

export const AGENT_PROMPTS: Record<string, string> = {
  orthopedics: ORTHOPEDICS_SYSTEM_PROMPT,
  neurology: COMING_SOON_PROMPT('Agente de Neurologia'),
  geriatrics: COMING_SOON_PROMPT('Agente de Geriatria'),
  hospital: COMING_SOON_PROMPT('Agente Hospitalar'),
  homecare: COMING_SOON_PROMPT('Agente Domiciliar'),
}

export const getSystemPrompt = (slug: string): string => {
  return AGENT_PROMPTS[slug] ?? COMING_SOON_PROMPT('Agente PhysioFriend')
}
