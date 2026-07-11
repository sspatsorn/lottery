import type { LuckyBirthdayResult, LotteryDigitCount } from '~/types/lottery'
import { parseBirthDate } from '~/utils/formatDate'

const ELEMENTS = ['ไฟ', 'น้ำ', 'ลม', 'ดิน', 'ทอง'] as const

const PREDICTIONS = [
  'วันนี้โชคดีเรื่องการเงิน มีโอกาสได้รับข่าวดี',
  'เลขนี้ส่งเสริมความรักและความสัมพันธ์ที่ดี',
  'ช่วงนี้เหมาะกับการลงทุนและเริ่มต้นสิ่งใหม่',
  'พลังเลขนี้ช่วยเสริมความมั่นใจในการตัดสิตใจ',
  'โอกาสทองกำลังมาเยือน อย่าพลาดโชคครั้งนี้',
]

const TRAITS = [
  'มีเสน่ห์ดึงดูดโชคลาภ',
  'คิดบวก มองโลกในแง่ดี',
  'มีสัญชาตญาณแม่นยำ',
  'เป็นคนมีไหวพริต',
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

/** Fallback: คำนวณเลขมงคลจากวันเกิด (เมื่อ Gemini ไม่พร้อม) */
export function calculateLuckyFromBirthday(
  birthDate: string,
  digitCount: LotteryDigitCount = 6,
): LuckyBirthdayResult {
  const date = parseBirthDate(birthDate) ?? new Date(birthDate)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const seed = hashString(`${day}${month}${year}`)
  const sum = String(day + month + year).split('').reduce((acc, d) => acc + Number(d), 0)
  const base = (seed + sum * 7) % 10 ** digitCount

  return {
    birthDate,
    luckyNumber: base.toString().padStart(digitCount, '0'),
    digitCount,
    prediction: pickFromArray(PREDICTIONS, seed + sum),
    traits: [
      pickFromArray(TRAITS, seed),
      pickFromArray(TRAITS, seed + 3),
      pickFromArray(TRAITS, seed + 7),
    ],
    element: pickFromArray(ELEMENTS, seed),
  }
}
