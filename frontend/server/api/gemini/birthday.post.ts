import type { LuckyBirthdayResult, LotteryDigitCount } from '~/types/lottery'
import { calculateLuckyFromBirthday } from '../../../app/utils/birthdayFallback'
import { parseBirthDate } from '../../../app/utils/formatDate'
import { callGemini, parseGeminiJson } from '../../utils/gemini'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  const body = await readBody<{ birthDate: string, digitCount: LotteryDigitCount }>(event)
  if (!body?.birthDate) {
    throw createError({ statusCode: 400, statusMessage: 'birthDate is required' })
  }

  const digitCount = body.digitCount ?? 6

  if (!apiKey) {
    return { ...calculateLuckyFromBirthday(body.birthDate, digitCount), source: 'fallback' as const }
  }

  const date = parseBirthDate(body.birthDate) ?? new Date(body.birthDate)
  const thaiDate = new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    calendar: 'buddhist',
  }).format(date)

  const prompt = `คุณเป็นหมอดูเลขมงคลไทย
วิเคราะห์เลขนำโชคจากวันเกิด: ${thaiDate} (${body.birthDate})
สร้างเลขนำโชค ${digitCount} หลัก (เติม 0 ด้านหน้าให้ครบ) และตอบเป็นภาษาไทย
ส่งกลับ JSON ตามโครงสร้างนี้เท่านั้น:
{
  "luckyNumber": "000123",
  "prediction": "คำทำนายสนุกๆ 2-3 ประโยค",
  "traits": ["ลักษณะเด่น 1", "ลักษณะเด่น 2", "ลักษณะเด่น 3"],
  "element": "ไฟ"
}

กฎ:
- luckyNumber ต้องมี ${digitCount} หลัก
- element ต้องเป็นหนึ่งใน: ไฟ, น้ำ, ลม, ดิน, ทอง
- traits มี 3 รายการ`

  try {
    const raw = await callGemini(prompt, apiKey)
    const parsed = parseGeminiJson<Omit<LuckyBirthdayResult, 'birthDate' | 'digitCount' | 'source'>>(raw)

    return {
      birthDate: body.birthDate,
      digitCount,
      luckyNumber: parsed.luckyNumber.padStart(digitCount, '0'),
      prediction: parsed.prediction,
      traits: (parsed.traits ?? []).slice(0, 3),
      element: parsed.element ?? 'ทอง',
      source: 'gemini' as const,
    } satisfies LuckyBirthdayResult
  }
  catch (err) {
    console.warn('[Gemini birthday] fallback:', err instanceof Error ? err.message.slice(0, 120) : err)
    return { ...calculateLuckyFromBirthday(body.birthDate, digitCount), source: 'fallback' as const }
  }
})
