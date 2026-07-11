<script setup lang="ts">
import type { LotteryDigitCount } from '~/types/lottery'

const props = defineProps<{
  digitCount: LotteryDigitCount
  spinning: boolean
  result: string
}>()

const emit = defineEmits<{
  complete: []
}>()

const { playTick, playWin, resume } = useSound()

const displayDigits = ref<string[]>([])
const stoppedReels = ref<boolean[]>([])
const bouncing = ref(false)

let spinInterval: ReturnType<typeof setInterval> | null = null
let stopTimeouts: ReturnType<typeof setTimeout>[] = []

function initDigits() {
  displayDigits.value = Array.from({ length: props.digitCount }, () => '0')
  stoppedReels.value = Array.from({ length: props.digitCount }, () => false)
}

function randomDigit(): string {
  return Math.floor(Math.random() * 10).toString()
}

function clearTimers() {
  if (spinInterval) {
    clearInterval(spinInterval)
    spinInterval = null
  }
  stopTimeouts.forEach(clearTimeout)
  stopTimeouts = []
}

function startSpin() {
  clearTimers()
  bouncing.value = false
  initDigits()
  stoppedReels.value = Array.from({ length: props.digitCount }, () => false)

  resume()
  spinInterval = setInterval(() => {
    displayDigits.value = displayDigits.value.map((_, i) =>
      stoppedReels.value[i] ? displayDigits.value[i]! : randomDigit(),
    )
    playTick()
  }, 50)
}

function stopSpin(finalNumber: string) {
  clearTimers()
  const finalDigits = finalNumber.padStart(props.digitCount, '0').split('')

  finalDigits.forEach((digit, index) => {
    const timeout = setTimeout(() => {
      displayDigits.value[index] = digit
      stoppedReels.value[index] = true

      if (index === finalDigits.length - 1) {
        bouncing.value = true
        playWin()
        emit('complete')
        setTimeout(() => {
          bouncing.value = false
        }, 600)
      }
    }, index * 250 + 100)
    stopTimeouts.push(timeout)
  })
}

watch(
  () => props.spinning,
  (spinning, wasSpinning) => {
    if (spinning) {
      startSpin()
    }
    else if (wasSpinning && props.result) {
      stopSpin(props.result)
    }
  },
)

watch(
  () => props.result,
  (result) => {
    if (result && !props.spinning) {
      const digits = result.padStart(props.digitCount, '0').split('')
      displayDigits.value = digits
      stoppedReels.value = Array.from({ length: props.digitCount }, () => true)
    }
  },
)

watch(
  () => props.digitCount,
  () => {
    if (!props.spinning) {
      initDigits()
      if (props.result) {
        const digits = props.result.padStart(props.digitCount, '0').split('')
        displayDigits.value = digits
        stoppedReels.value = Array.from({ length: props.digitCount }, () => true)
      }
    }
  },
)

onMounted(() => {
  initDigits()
  if (props.result) {
    const digits = props.result.padStart(props.digitCount, '0').split('')
    displayDigits.value = digits
    stoppedReels.value = Array.from({ length: props.digitCount }, () => true)
  }
})

onUnmounted(() => {
  clearTimers()
})
</script>

<template>
  <div
    class="slot-machine"
    :class="{ 'slot-machine--bouncing': bouncing }"
  >
    <div class="slot-machine__frame">
      <div class="slot-machine__reels">
        <div
          v-for="(digit, index) in displayDigits"
          :key="index"
          class="reel-wrap"
        >
          <div
            class="reel"
            :class="{
              'reel--spinning': spinning && !stoppedReels[index],
              'reel--stopped': stoppedReels[index],
              'reel--bounce': bouncing && stoppedReels[index],
            }"
          >
            <div class="reel__bezel">
              <div class="reel__window">
                <span class="reel__digit">{{ digit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slot-machine {
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slot-machine--bouncing {
  transform: scale(1.015);
}

.slot-machine__frame {
  position: relative;
  border-radius: 1.25rem;
  padding: 0.875rem 1rem;
  background: linear-gradient(145deg, #fafafa 0%, #f0f0f0 50%, #e8e8e8 100%);
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 -1px 0 rgba(255, 255, 255, 0.8),
    0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
}

.slot-machine__frame::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 1rem;
  border: 1px solid rgba(245, 158, 11, 0.15);
  pointer-events: none;
}

.slot-machine__reels {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  flex-wrap: nowrap;
}

@media (min-width: 640px) {
  .slot-machine__reels {
    gap: 0.5rem;
  }
}

.reel-wrap {
  perspective: 300px;
}

.reel {
  transition: transform 0.2s ease, filter 0.2s ease;
}

.reel--spinning {
  animation: reel-shake 0.08s ease-in-out infinite;
  filter: brightness(1.05);
}

.reel--spinning .reel__digit {
  animation: digit-blur 0.08s ease-in-out infinite;
}

.reel--stopped .reel__bezel {
  box-shadow:
    0 4px 12px rgba(245, 158, 11, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.reel--bounce {
  animation: reel-land 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.reel__bezel {
  position: relative;
  border-radius: 0.875rem;
  padding: 3px;
  background: linear-gradient(160deg, #fde68a 0%, #f59e0b 40%, #d97706 100%);
  box-shadow:
    0 3px 8px rgba(217, 119, 6, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: box-shadow 0.3s ease;
}

.reel__window {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 3.5rem;
  border-radius: 0.625rem;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 45%, #f3f4f6 100%);
  box-shadow:
    inset 0 3px 8px rgba(0, 0, 0, 0.08),
    inset 0 -2px 4px rgba(255, 255, 255, 0.9);
  overflow: hidden;
}

@media (min-width: 640px) {
  .reel__window {
    width: 3rem;
    height: 4rem;
  }
}

@media (min-width: 768px) {
  .reel__window {
    width: 3.5rem;
    height: 4.75rem;
  }
}

/* เส้นกรอบหน้าต่างสล็อต */
.reel__window::before,
.reel__window::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.35), transparent);
  z-index: 2;
}

.reel__window::before {
  top: 28%;
}

.reel__window::after {
  bottom: 28%;
}

.reel__digit {
  position: relative;
  z-index: 1;
  font-family: 'Noto Sans Thai', system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: #d97706;
}

@supports (-webkit-background-clip: text) {
  .reel__digit {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 55%, #b45309 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
}

@media (min-width: 640px) {
  .reel__digit {
    font-size: 2.125rem;
  }
}

@media (min-width: 768px) {
  .reel__digit {
    font-size: 2.5rem;
  }
}

@keyframes reel-shake {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-1px); }
  75% { transform: translateY(1px); }
}

@keyframes digit-blur {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50% { transform: scaleY(1.08); opacity: 0.85; }
}

@keyframes reel-land {
  0% { transform: scale(1.2) translateY(-4px); }
  60% { transform: scale(0.96) translateY(2px); }
  100% { transform: scale(1) translateY(0); }
}
</style>
