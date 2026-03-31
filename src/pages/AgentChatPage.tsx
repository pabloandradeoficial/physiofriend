import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Send,
  Plus,
  Bookmark,
  ChevronRight,
  Bone,
  Brain,
  HeartHandshake,
  Activity,
  Home,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { getAgentBySlug } from '@/constants/agents'
import { getSystemPrompt } from '@/constants/prompts'
import { streamMessageToGemini } from '@/services/gemini'
import type { ChatMessage } from '@/services/gemini'
import type { Message } from '@/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>> = {
  Bone, Brain, HeartHandshake, Activity, Home,
}

// Simple markdown renderer for bold and lists
const renderMarkdown = (text: string) => {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Headers
    if (line.startsWith('## ')) {
      return <h3 key={i} style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a', marginTop: '0.75rem', marginBottom: '0.25rem' }}>{line.slice(3)}</h3>
    }
    if (line.startsWith('### ')) {
      return <h4 key={i} style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginTop: '0.5rem', marginBottom: '0.15rem' }}>{line.slice(4)}</h4>
    }
    // List items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.25rem' }}>
          <span style={{ color: '#d4a843', flexShrink: 0, marginTop: '0.1rem' }}>·</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      )
    }
    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s(.+)/)
    if (numMatch) {
      return (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.25rem' }}>
          <span style={{ color: '#d4a843', flexShrink: 0, fontWeight: 600, minWidth: '1rem' }}>{numMatch[1]}.</span>
          <span>{renderInline(numMatch[2])}</span>
        </div>
      )
    }
    // Empty line
    if (line.trim() === '') return <br key={i} />
    // Normal paragraph
    return <p key={i} style={{ margin: 0 }}>{renderInline(line)}</p>
  })
}

const renderInline = (text: string): React.ReactNode => {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600, color: '#1a1a1a' }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

const AgentChatPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const agent = getAgentBySlug(slug || '')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [geminiHistory, setGeminiHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userText = input.trim()
    setError(null)

    const userMsg: Message = {
      id: Date.now().toString(),
      conversation_id: 'local',
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setIsTyping(true)

    // Placeholder para streaming
    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, {
      id: assistantId,
      conversation_id: 'local',
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    }])

    try {
      const systemPrompt = getSystemPrompt(slug || '')
      let fullResponse = ''

      await streamMessageToGemini(
        systemPrompt,
        geminiHistory,
        userText,
        (chunk) => {
          fullResponse += chunk
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId ? { ...m, content: fullResponse } : m
            )
          )
        },
      )

      // Atualiza histórico do Gemini
      setGeminiHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: fullResponse }] },
      ])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao conectar com o agente.'
      setError(errorMsg)
      setMessages(prev => prev.filter(m => m.id !== assistantId))
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewCase = () => {
    setMessages([])
    setGeminiHistory([])
    setSaved(false)
    setInput('')
    setError(null)
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="text-center">
          <p className="text-lg font-medium mb-2" style={{ color: '#1a1a1a' }}>Agente não encontrado</p>
          <button onClick={() => navigate('/agents')} className="text-sm font-medium" style={{ color: '#d4a843' }}>
            Voltar aos agentes
          </button>
        </div>
      </div>
    )
  }

  const Icon = ICON_MAP[agent.icon] || Bone

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f8f7f5' }}>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Chat Header */}
        <div
          className="flex items-center gap-4 px-6 py-4 bg-white flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <button
            onClick={() => navigate('/agents')}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
            style={{ color: '#6b7280' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = '#1a1a1a' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280' }}
          >
            <ArrowLeft size={18} />
          </button>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#faf3e0', border: '1px solid #f3e4b8' }}
          >
            <Icon size={18} style={{ color: '#b8902a' }} />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-none mb-1 truncate" style={{ color: '#1a1a1a', letterSpacing: '-0.01em' }}>
              {agent.name}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs font-light truncate" style={{ color: '#9ca3af' }}>{agent.specialty}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                <span className="text-xs font-light" style={{ color: '#22c55e' }}>Gemini 2.0 Flash</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleNewCase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#6b7280', border: '1px solid rgba(0,0,0,0.07)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = '#1a1a1a' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#6b7280' }}
            >
              <Plus size={13} />
              Novo caso
            </button>
            <button
              onClick={() => setSaved(s => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: saved ? '#faf3e0' : 'rgba(0,0,0,0.04)',
                color: saved ? '#b8902a' : '#6b7280',
                border: saved ? '1px solid #f3e4b8' : '1px solid rgba(0,0,0,0.07)',
              }}
            >
              <Bookmark size={13} />
              {saved ? 'Salvo' : 'Salvar'}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="flex items-center gap-3 px-6 py-3 flex-shrink-0"
            style={{ backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca' }}
          >
            <AlertCircle size={15} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p className="text-xs font-medium" style={{ color: '#dc2626' }}>{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-xs" style={{ color: '#9ca3af' }}>Fechar</button>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#faf3e0', border: '1px solid #f3e4b8', boxShadow: '0 4px 16px rgba(212,168,67,0.12)' }}
              >
                <Icon size={24} style={{ color: '#b8902a' }} />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#1a1a1a', letterSpacing: '-0.015em' }}>
                {agent.name}
              </h2>
              <p className="text-sm font-light leading-relaxed mb-8" style={{ color: '#9ca3af' }}>
                {agent.long_description}
              </p>
              <div className="w-24 mb-8" style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e8ce85, transparent)' }} />
              <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: '#c4c4c4', letterSpacing: '0.1em' }}>
                Sugestões de início
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {agent.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="flex items-center gap-2 text-left px-4 py-3 rounded-xl text-sm font-light transition-all duration-150"
                    style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', color: '#4b5563' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; e.currentTarget.style.backgroundColor = '#fdfaf3' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'; e.currentTarget.style.backgroundColor = '#ffffff' }}
                  >
                    <ChevronRight size={13} style={{ color: '#d4a843', flexShrink: 0 }} />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {message.role === 'assistant' && (
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: '#faf3e0', border: '1px solid #f3e4b8' }}
                    >
                      <Icon size={15} style={{ color: '#b8902a' }} />
                    </div>
                  )}
                  <div
                    className="max-w-[82%] px-4 py-3 text-sm font-light leading-relaxed"
                    style={
                      message.role === 'user'
                        ? { backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: '18px 18px 4px 18px' }
                        : {
                            backgroundColor: '#ffffff',
                            color: '#374151',
                            border: '1px solid rgba(0,0,0,0.07)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            borderRadius: '18px 18px 18px 4px',
                          }
                    }
                  >
                    {message.role === 'assistant' ? (
                      message.content === '' ? (
                        <div className="flex items-center gap-1 py-1">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{ backgroundColor: '#d4a843', animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          {renderMarkdown(message.content)}
                        </div>
                      )
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 px-6 py-4 bg-white" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="max-w-3xl mx-auto">
            <div
              className="flex items-end gap-3 p-3 rounded-2xl transition-all duration-200"
              style={{ backgroundColor: '#f9fafb', border: '1.5px solid rgba(0,0,0,0.08)' }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = '#d4a843'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,168,67,0.08)' }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); autoResize() }}
                onKeyDown={handleKeyDown}
                placeholder="Descreva o caso clínico ou faça uma pergunta..."
                rows={1}
                className="flex-1 bg-transparent text-sm font-light leading-relaxed outline-none placeholder:font-light"
                style={{ color: '#1a1a1a', fontFamily: 'Montserrat, sans-serif', resize: 'none', maxHeight: '160px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all duration-200"
                style={{
                  backgroundColor: input.trim() && !isTyping ? '#1a1a1a' : 'rgba(0,0,0,0.06)',
                  color: input.trim() && !isTyping ? '#ffffff' : '#9ca3af',
                }}
                onMouseEnter={e => { if (input.trim() && !isTyping) e.currentTarget.style.backgroundColor = '#d4a843' }}
                onMouseLeave={e => { if (input.trim() && !isTyping) e.currentTarget.style.backgroundColor = '#1a1a1a' }}
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs font-light mt-2 text-center" style={{ color: '#c4c4c4' }}>
              Enter para enviar · Shift+Enter para nova linha
            </p>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div
        className="hidden xl:flex flex-col w-72 bg-white flex-shrink-0 overflow-y-auto"
        style={{ borderLeft: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="p-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: '#c4c4c4', letterSpacing: '0.1em' }}>
            Sobre este agente
          </p>
          <p className="text-sm font-light leading-relaxed" style={{ color: '#6b7280' }}>
            {agent.long_description}
          </p>
        </div>

        <div className="p-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: '#c4c4c4', letterSpacing: '0.1em' }}>
            Perguntas frequentes
          </p>
          <div className="space-y-2">
            {agent.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="flex items-start gap-2 w-full text-left p-3 rounded-xl text-xs font-light transition-all duration-150"
                style={{ backgroundColor: '#f9fafb', color: '#4b5563', border: '1px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fdfaf3'; e.currentTarget.style.borderColor = '#f3e4b8' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.borderColor = 'transparent' }}
              >
                <ChevronRight size={12} style={{ color: '#d4a843', flexShrink: 0, marginTop: '1px' }} />
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#fdfaf3', border: '1px solid #f3e4b8' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} style={{ color: '#d4a843' }} />
              <p className="text-xs font-semibold" style={{ color: '#7a5c18' }}>Motor de IA</p>
            </div>
            <p className="text-xs font-light leading-relaxed" style={{ color: '#92650a', opacity: 0.75 }}>
              Powered by Google Gemini 2.0 Flash. Respostas geradas por IA — sempre valide com seu raciocínio clínico.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentChatPage
