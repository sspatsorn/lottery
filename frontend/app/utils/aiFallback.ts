import type { AiAnalysisResult, DigitMeaning } from '~/types/lottery'

const DIGIT_MEANINGS: Record<string, { meaning: string, energy: DigitMeaning['energy'] }> = {
  '0': { meaning: 'จุดเริ่มต้นใหม่ ความสมบูรณ์แบบ', energy: 'medium' },
  '1': { meaning: 'ผู้นำ ความมุ่งมั่น เป็นหนึ่งเดียว', energy: 'high' },
  '2': { meaning: 'ความสมดุล คู่ครอง ความร่วมมือ', energy: 'medium' },
  '3': { meaning: 'ความคิดสร้างสรรค์ การสื่อสาร', energy: 'high' },
  '4': { meaning: 'รากฐานมั่นคง ความอดทน', energy: 'low' },
  '5': { meaning: 'การเปลี่ยนแปลง การผจญภัย', energy: 'high' },
  '6': { meaning: 'ความรัก ครอบครัว ความอุดมสมบูรณ์', energy: 'medium' },
  '7': { meaning: 'ปัญญา โชคลาภ จิตวิญญาณ', energy: 'high' },
  '8': { meaning: 'ความมั่งคั่ง อำนาจ การเงิน', energy: 'high' },
  '9': { meaning: 'จบสิ้น สมบูรณ์ มงคลสูงสุด', energy: 'medium' },
}

const AI_SUMMARIES = [
  'เลขนี้เด่นเรื่องการเงิน โอกาสใหม่ และโชคลาภ',
  'พลังเลขส่งเสริมความรัก ความสัมพันธ์ และความสุข',
  'เลขชุดนี้มีพลังแห่งความสำเร็จและความก้าวหน้า',
]

const AI_HIGHLIGHTS = [
  'โอกาสทางการเงิน', 'ความรักและความสัมพันธ์', 'การงานก้าวหน้า',
  'โชคลาภจากคนรอบข้าง', 'ข่าวดีที่กำลังมา',
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pickFromArray<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length]!
}

/** Fallback เมื่อ Gemini API ไม่พร้อมใช้งาน */
export function analyzeNumberFallback(number: string): AiAnalysisResult {
  const seed = hashString(number)
  const digits = number.split('')

  const digitMeanings: DigitMeaning[] = digits.map((digit) => {
    const info = DIGIT_MEANINGS[digit] ?? DIGIT_MEANINGS['0']!
    return { digit, meaning: info.meaning, energy: info.energy }
  })

  const digitSum = digits.reduce((acc, d) => acc + Number(d), 0)
  const luckScore = Math.min(100, 50 + (digitSum % 30) + (seed % 20))

  return {
    digitMeanings,
    summary: pickFromArray(AI_SUMMARIES, seed),
    highlights: [
      pickFromArray(AI_HIGHLIGHTS, seed),
      pickFromArray(AI_HIGHLIGHTS, seed + 2),
      pickFromArray(AI_HIGHLIGHTS, seed + 5),
    ],
    luckScore,
    category: luckScore >= 80 ? 'เลขทองคำ' : 'เลขทั่วไป',
  }
}
