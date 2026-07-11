export function useShare() {
  const copied = ref(false)
  let copyTimeout: ReturnType<typeof setTimeout> | null = null

  async function copyNumber(number: string): Promise<boolean> {
    if (!import.meta.client || !number) return false

    try {
      await navigator.clipboard.writeText(number)
      copied.value = true
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        copied.value = false
      }, 2000)
      return true
    }
    catch {
      // fallback สำหรับ browser เก่า
      const textarea = document.createElement('textarea')
      textarea.value = number
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      copied.value = ok
      return ok
    }
  }

  async function shareNumber(number: string, digitCount: number): Promise<boolean> {
    if (!import.meta.client || !number) return false

    const text = `🍀 เลขนำโชค ${digitCount} ตัว: ${number}\nสุ่มจากเว็บสุ่มเลขนำโชค`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'สุ่มเลขนำโชค',
          text,
        })
        return true
      }
      catch (err) {
        if ((err as Error).name === 'AbortError') return false
      }
    }

    return copyNumber(number)
  }

  const canShare = computed(() => {
    if (!import.meta.client) return false
    return typeof navigator.share === 'function'
  })

  return {
    copied,
    canShare,
    copyNumber,
    shareNumber,
  }
}
