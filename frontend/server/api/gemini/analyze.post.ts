import type { AiAnalysisResult } from '~/types/lottery'
import { analyzeNumberFallback } from '../../../app/utils/aiFallback'
import { callGemini, parseGeminiJson } from '../../utils/gemini'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  const body = await readBody<{ number: string }>(event)
  if (!body?.number) {
    throw createError({ statusCode: 400, statusMessage: 'number is required' })
  }

  if (!apiKey) {
    return { ...analyzeNumberFallback(body.number), source: 'fallback' as const }
  }

  const prompt = `คุณเป็นผู้เชี่ยวชาญด้านเลขศาสตร์และโหราศาสตร์ไทย
วิเคราะห์เลขหวย "${body.number}" และตอบเป็นภาษาไทยเท่านั้น
ส่งกลับ JSON ตามโครงสร้างนี้เท่านั้น ไม่ต้องมีข้อความอื่น:
{
  "digitMeanings": [
    { "digit": "0", "meaning": "ความหมายภาษาไทย", "energy": "high" }
  ],
  "summary": "สรุปภาพรวมเลขนี้ 1-2 ประโยค เช่น เลขนี้เด่นเรื่องการเงิน โอกาสใหม่ และโชคลาภ",
  "highlights": ["จุดเด่น 1", "จุดเด่น 2", "จุดเด่น 3"],
  "luckScore": 85,
  "category": "ชื่อหมวด เช่น เลขทองคำ"
}

กฎ:
- digitMeanings ต้องมีครบทุกหลักของเลข ${body.number}
- energy ต้องเป็น "high", "medium" หรือ "low" เท่านั้น
- luckScore เป็นตัวเลข 0-100
- highlights มี 3 รายการ`

  try {
    const raw = await callGemini(prompt, apiKey)
    const result = parseGeminiJson<AiAnalysisResult>(raw)

    result.luckScore = Math.min(100, Math.max(0, Math.round(result.luckScore ?? 70)))
    result.highlights = (result.highlights ?? []).slice(0, 3)
    result.digitMeanings = result.digitMeanings ?? []

    return { ...result, source: 'gemini' as const }
  }
  catch (err) {
    console.warn('[Gemini analyze] fallback:', err instanceof Error ? err.message.slice(0, 120) : err)
    return { ...analyzeNumberFallback(body.number), source: 'fallback' as const }
  }
})
