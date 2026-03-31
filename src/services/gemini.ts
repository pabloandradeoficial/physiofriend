import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI: GoogleGenerativeAI | null = null

const getClient = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

export interface ChatMessage {
  role: 'user' | 'model'
  parts: [{ text: string }]
}

/**
 * Send a message to Gemini with full conversation history and system prompt.
 * Returns the response text.
 */
export async function sendMessageToGemini(
  systemPrompt: string,
  history: ChatMessage[],
  newMessage: string,
): Promise<string> {
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY não configurada.')
  }

  const client = getClient()

  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  })

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.3, // baixo para raciocínio clínico preciso
      topP: 0.8,
    },
  })

  const result = await chat.sendMessage(newMessage)
  const response = await result.response
  return response.text()
}

/**
 * Stream a message to Gemini with full conversation history and system prompt.
 * Calls onChunk with each text chunk as it arrives.
 */
export async function streamMessageToGemini(
  systemPrompt: string,
  history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void,
): Promise<string> {
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY não configurada.')
  }

  const client = getClient()

  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  })

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.3,
      topP: 0.8,
    },
  })

  const result = await chat.sendMessageStream(newMessage)

  let fullText = ''
  for await (const chunk of result.stream) {
    const chunkText = chunk.text()
    fullText += chunkText
    onChunk(chunkText)
  }

  return fullText
}
