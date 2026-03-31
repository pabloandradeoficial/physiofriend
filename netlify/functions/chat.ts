import { getSystemPrompt } from '../../src/constants/prompts/index'

// ─────────────────────────────────────────────────────────────────────────────
// Netlify Function — /.netlify/functions/chat
// Chama a API REST do Google Gemini diretamente (sem SDK).
// A GEMINI_API_KEY fica exclusivamente no servidor.
// ─────────────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const MODEL = 'gemini-1.5-flash-latest'

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY não configurada.' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  let slug: string
  let history: Array<{ role: string; parts: [{ text: string }] }>
  let message: string

  try {
    const body = await req.json()
    slug = body.slug ?? ''
    history = body.history ?? []
    message = body.message ?? ''
    if (!message) throw new Error('message is required')
  } catch {
    return new Response(JSON.stringify({ error: 'Corpo da requisição inválido.' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const systemPrompt = getSystemPrompt(slug)

  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`

  const geminiBody = {
    contents: [
      { role: 'user',  parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Entendido. Estou pronto para ajudar.' }] },
      ...history,
      { role: 'user',  parts: [{ text: message }] },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  }

  let geminiRes: Response
  try {
    geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Falha ao conectar com a API do Gemini.' }), {
      status: 502,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  if (!geminiRes.ok) {
    const detail = await geminiRes.text().catch(() => '')
    return new Response(JSON.stringify({ error: `Gemini API error ${geminiRes.status}: ${detail}` }), {
      status: geminiRes.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const data = await geminiRes.json() as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  return new Response(JSON.stringify({ text }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}
