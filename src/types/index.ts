export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Agent {
  id: string
  slug: string
  name: string
  specialty: string
  description: string
  long_description: string
  icon: string
  color: string
  suggestions: string[]
}

export interface Conversation {
  id: string
  agent_id: string
  user_id: string
  title: string
  saved: boolean
  created_at: string
  updated_at: string
  messages: Message[]
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
