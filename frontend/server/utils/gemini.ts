const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
] as const

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

export class GeminiApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'GeminiApiError'
    this.statusCode = statusCode
  }
}

/** เรียก Google Gemini API — ลองหลาย model ถ้าตัวแรกล้มเหลว */
export async function callGemini(prompt: string, apiKey: string): Promise<string> {
  let lastError: GeminiApiError | null = null

  for (const model of GEMINI_MODELS) {
    try {
      return await callGeminiModel(prompt, apiKey, model)
    }
    catch (err) {
      if (err instanceof GeminiApiError) {
        lastError = err
        // ลอง model ถัดไปเมื่อ quota/rate limit
        if (err.statusCode === 429 || err.statusCode === 503) continue
      }
      throw err
    }
  }

  throw lastError ?? new GeminiApiError(503, 'Gemini API unavailable')
}

async function callGeminiModel(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<string> {
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new GeminiApiError(response.status, errorText)
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new GeminiApiError(502, 'Gemini returned empty response')
  }

  return text
}

/** แปลง JSON string จาก Gemini เป็น object */
export function parseGeminiJson<T>(text: string): T {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned) as T
}
