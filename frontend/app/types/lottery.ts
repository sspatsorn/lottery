/** จำนวนหลักของเลขหวยที่รองรับ */
export type LotteryDigitCount = 2 | 3 | 6

/** ผลลัพธ์จากการสุ่มเลข */
export interface LotteryResult {
  number: string
  digitCount: LotteryDigitCount
  timestamp: number
}

/** รายการในประวัติ (เก็บใน LocalStorage) */
export interface HistoryEntry extends LotteryResult {
  id: string
}

/** แหล่งที่มาของผลวิเคราะห์ */
export type AiSource = 'gemini' | 'fallback'

/** ผลลัพธ์เลขมงคลจากวันเกิด */
export interface LuckyBirthdayResult {
  birthDate: string
  luckyNumber: string
  digitCount: LotteryDigitCount
  prediction: string
  traits: string[]
  element: string
  source?: AiSource
}

/** ผลวิเคราะห์ AI */
export interface DigitMeaning {
  digit: string
  meaning: string
  energy: 'low' | 'medium' | 'high'
}

export interface AiAnalysisResult {
  digitMeanings: DigitMeaning[]
  summary: string
  highlights: string[]
  luckScore: number
  category: string
  source?: AiSource
}

/** ตัวเลือกประเภทการสุ่ม */
export interface LotteryTypeOption {
  value: LotteryDigitCount
  label: string
  description: string
  icon: string
}
