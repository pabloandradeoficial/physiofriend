import { supabase } from '@/lib/supabase'
import type { Conversation, Message } from '@/types'

export async function createConversation(
  agentSlug: string,
  firstMessage: string,
): Promise<Conversation | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const title = firstMessage.length > 60 ? firstMessage.slice(0, 57) + '...' : firstMessage

  const { data, error } = await supabase
    .from('conversations')
    .insert({ agent_id: agentSlug, user_id: user.id, title, saved: false })
    .select()
    .single()

  if (error) {
    console.error('createConversation error:', error)
    return null
  }
  return data as Conversation
}

export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single()

  if (error) {
    console.error('addMessage error:', error)
    return null
  }

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data as Message
}

export async function getConversations(): Promise<Conversation[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('getConversations error:', error)
    return []
  }
  return (data ?? []) as Conversation[]
}

export async function getSavedConversations(): Promise<Conversation[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .eq('saved', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('getSavedConversations error:', error)
    return []
  }
  return (data ?? []) as Conversation[]
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getMessages error:', error)
    return []
  }
  return (data ?? []) as Message[]
}

export async function toggleSaved(conversationId: string, saved: boolean): Promise<void> {
  await supabase.from('conversations').update({ saved }).eq('id', conversationId)
}
