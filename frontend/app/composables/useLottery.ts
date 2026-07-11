import type { LotteryDigitCount, LotteryTypeOption } from '~/types/lottery'

/** ตัวเลือกประเภทการสุ่มเลข */
export const LOTTERY_TYPE_OPTIONS: LotteryTypeOption[] = [
  { value: 2, label: '2 ตัว', description: 'เลขท้าย 2 ตัว', icon: '🎯' },
  { value: 3, label: '3 ตัว', description: 'เลขท้าย 3 ตัว', icon: '🎰' },
  { value: 6, label: '6 ตัว', description: 'เลขเต็ม 6 ตัว', icon: '🏆' },
]

/** สร้างเลขสุ่มด้วย Math.random และเติม 0 ด้านหน้า */
export function generateRandomNumber(digitCount: LotteryDigitCount): string {
  const max = 10 ** digitCount
  const num = Math.floor(Math.random() * max)
  return num.toString().padStart(digitCount, '0')
}

/** ระยะเวลาสุ่มแบบสุ่ม 2–3 วินาที */
export function getSpinDuration(): number {
  return 2000 + Math.floor(Math.random() * 1001)
}

export function useLottery() {
  const selectedType = ref<LotteryDigitCount>(6)
  const isSpinning = ref(false)
  const currentNumber = ref<string>('')
  const spinDuration = ref(2500)

  /** เริ่มสุ่มเลข — คืน Promise เมื่อ animation เสร็จ */
  async function spin(digitCount?: LotteryDigitCount): Promise<string> {
    if (isSpinning.value) return currentNumber.value

    const count = digitCount ?? selectedType.value
    selectedType.value = count
    isSpinning.value = true
    spinDuration.value = getSpinDuration()

    const result = generateRandomNumber(count)

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        currentNumber.value = result
        isSpinning.value = false
        resolve()
      }, spinDuration.value)
    })

    return result
  }

  function setType(type: LotteryDigitCount) {
    if (!isSpinning.value) {
      selectedType.value = type
    }
  }

  return {
    selectedType,
    isSpinning,
    currentNumber,
    spinDuration,
    spin,
    setType,
    typeOptions: LOTTERY_TYPE_OPTIONS,
  }
}
