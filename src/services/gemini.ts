// ─────────────────────────────────────────────────────────────────────────────
// Gemini client — frontend layer
// Chama /.netlify/functions/chat e recebe resposta JSON completa.
// A API key nunca toca o bundle do browser.
// ─────────────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'model'
  parts: [{ text: string }]
}

const FUNCTION_URL = '/.netlify/functions/chat'

/**
 * Envia mensagem via função serverless e retorna a resposta completa.
 * onChunk é chamado uma vez com o texto completo (compatível com AgentChatPage).
 */
export async function streamMessageToGemini(
  slug: string,
  history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void,
): Promise<string> {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, history, message: newMessage }),
  })

  const data = await response.json() as { text?: string; error?: string }

  if (!response.ok || data.error) {
    throw new Error(data.error ?? `Erro ${response.status} ao chamar o agente.`)
  }

  const text = data.text ?? ''
  onChunk(text)
  return text
}
