import type { AiAnalysisResult, LuckyBirthdayResult, LotteryDigitCount } from '~/types/lottery'

export function useGemini() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /** วิเคราะห์เลขด้วย Gemini AI */
  async function analyzeNumber(number: string): Promise<AiAnalysisResult> {
    isLoading.value = true
    error.value = null
    try {
      return await $fetch<AiAnalysisResult>('/api/gemini/analyze', {
        method: 'POST',
        body: { number },
      })
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'เกิดข้อผิดพลาดในการวิเคราะห์'
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  /** วิเคราะห์เลขมงคลจากวันเกิดด้วย Gemini AI */
  async function analyzeBirthday(
    birthDate: string,
    digitCount: LotteryDigitCount = 6,
  ): Promise<LuckyBirthdayResult> {
    isLoading.value = true
    error.value = null
    try {
      return await $fetch<LuckyBirthdayResult>('/api/gemini/birthday', {
        method: 'POST',
        body: { birthDate, digitCount },
      })
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'เกิดข้อผิดพลาดในการวิเคราะห์'
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    analyzeNumber,
    analyzeBirthday,
  }
}
