import type { LuckyBirthdayResult, LotteryDigitCount } from '~/types/lottery'
import { generateRandomNumber } from '~/composables/useLottery'

export function useLucky() {
  const birthDate = ref('')
  const result = ref<LuckyBirthdayResult | null>(null)
  const isCalculating = ref(false)
  const { analyzeBirthday } = useGemini()

  /** วิเคราะห์เลขมงคลจากวันเกิดด้วย Gemini AI */
  async function calculate(digitCount: LotteryDigitCount = 6) {
    if (!birthDate.value) return null

    isCalculating.value = true
    try {
      result.value = await analyzeBirthday(birthDate.value, digitCount)
    }
    finally {
      isCalculating.value = false
    }
    return result.value
  }

  function reset() {
    birthDate.value = ''
    result.value = null
  }

  function getFunLuckyNumber(digitCount: LotteryDigitCount): string {
    return generateRandomNumber(digitCount)
  }

  return {
    birthDate,
    result,
    isCalculating,
    calculate,
    reset,
    getFunLuckyNumber,
  }
}
