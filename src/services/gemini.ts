// ─────────────────────────────────────────────────────────────────────────────
// Gemini client — frontend layer
// All calls go through the serverless function at /.netlify/functions/chat.
// The API key never touches the browser bundle.
// ─────────────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'model'
  parts: [{ text: string }]
}

const FUNCTION_URL = '/.netlify/functions/chat'

/**
 * Stream a response from Gemini via the serverless proxy.
 * Calls onChunk with each text fragment as it arrives (SSE).
 * Returns the full accumulated text when done.
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

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(err.error ?? `Erro ${response.status} ao chamar o agente.`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('Streaming não suportado neste ambiente.')

  const decoder = new TextDecoder()
  let fullText = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    // Keep incomplete last line in buffer
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6).trim()
      if (payload === '[DONE]') continue
      try {
        const parsed = JSON.parse(payload) as { text?: string; error?: string }
        if (parsed.error) throw new Error(parsed.error)
        if (parsed.text) {
          fullText += parsed.text
          onChunk(parsed.text)
        }
      } catch (e) {
        if (e instanceof Error && e.message !== 'Unexpected end of JSON input') throw e
      }
    }
  }

  return fullText
}
