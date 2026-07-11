/** เสียงเอฟเฟกต์ด้วย Web Audio API — ไม่ต้องโหลดไฟล์เสียง */
export function useSound() {
  let audioCtx: AudioContext | null = null

  function getContext(): AudioContext | null {
    if (!import.meta.client) return null
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext
        || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return null
      audioCtx = new AudioContextClass()
    }
    return audioCtx
  }

  /** เสียง tick ระหว่างหมุนสล็อต */
  function playTick() {
    try {
      const ctx = getContext()
      if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = 800 + Math.random() * 400
    osc.type = 'square'
    gain.gain.setValueAtTime(0.03, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
    }
    catch {
      // Safari อาจบล็อกเสียงก่อน user interaction
    }
  }

  /** เสียงเมื่อหยุดและได้เลข */
  function playWin() {
    try {
      const ctx = getContext()
      if (!ctx) return

    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.value = freq
      osc.type = 'sine'
      const start = ctx.currentTime + i * 0.1
      gain.gain.setValueAtTime(0.08, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3)

      osc.start(start)
      osc.stop(start + 0.3)
    })
    }
    catch {
      // ignore audio errors
    }
  }

  /** เปิด AudioContext หลัง user interaction */
  function resume() {
    const ctx = getContext()
    if (ctx?.state === 'suspended') {
      ctx.resume()
    }
  }

  return { playTick, playWin, resume }
}
