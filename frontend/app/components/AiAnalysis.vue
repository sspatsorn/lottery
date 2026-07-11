<script setup lang="ts">
import type { AiAnalysisResult } from '~/types/lottery'
import { analyzeNumberFallback } from '~/utils/aiFallback'

const props = defineProps<{
  number: string
}>()

const { analyzeNumber: analyzeWithGemini } = useGemini()

const analysis = ref<AiAnalysisResult | null>(null)
const isAnalyzing = ref(false)
const typedSummary = ref('')
const showContent = ref(false)
const usedFallback = ref(false)

let typeInterval: ReturnType<typeof setInterval> | null = null
let abortController: AbortController | null = null

function typeWriter(text: string) {
  if (typeInterval) clearInterval(typeInterval)
  typedSummary.value = ''
  let i = 0
  typeInterval = setInterval(() => {
    if (i < text.length) {
      typedSummary.value += text[i]
      i++
    }
    else if (typeInterval) {
      clearInterval(typeInterval)
      typeInterval = null
    }
  }, 25)
}

async function runAnalysis(num: string) {
  if (!num) {
    analysis.value = null
    showContent.value = false
    return
  }

  if (abortController) abortController.abort()
  abortController = new AbortController()

  isAnalyzing.value = true
  showContent.value = false
  typedSummary.value = ''
  usedFallback.value = false

  try {
    const result = await analyzeWithGemini(num)
    analysis.value = result
    usedFallback.value = result.source === 'fallback'
  }
  catch {
    usedFallback.value = true
    analysis.value = { ...analyzeNumberFallback(num), source: 'fallback' }
  }

  isAnalyzing.value = false
  showContent.value = true
  typeWriter(analysis.value.summary)
}

watch(
  () => props.number,
  (num) => {
    if (num) runAnalysis(num)
  },
  { immediate: true },
)

onUnmounted(() => {
  if (typeInterval) clearInterval(typeInterval)
  abortController?.abort()
})

function energyColor(energy: string): string {
  const map: Record<string, string> = {
    high: 'text-green-600',
    medium: 'text-gold-600',
    low: 'text-gray-400',
  }
  return map[energy] ?? 'text-gray-400'
}

function energyLabel(energy: string): string {
  const map: Record<string, string> = {
    high: 'สูง',
    medium: 'ปานกลาง',
    low: 'ต่ำ',
  }
  return map[energy] ?? energy
}

function scoreColor(score: number): string {
  if (score >= 80) return 'from-green-500 to-emerald-500'
  if (score >= 60) return 'from-gold-400 to-gold-500'
  return 'from-gray-300 to-gray-400'
}
</script>

<template>
  <div v-if="number" class="glass-card overflow-hidden">
    <div class="border-b border-gray-100 bg-gradient-to-r from-accent-purple/5 to-gold-500/5 px-5 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-purple/10 text-xl">
          ✨
        </div>
        <div>
          <h2 class="section-title">Gemini AI วิเคราะห์เลข</h2>
          <p class="text-xs text-muted">
            วิเคราะห์ด้วย Google Gemini
            <span v-if="usedFallback" class="text-amber-600"> (โหมดสำรอง)</span>
          </p>
        </div>
      </div>
    </div>

    <div class="p-5 sm:p-6">
      <div v-if="isAnalyzing" class="flex flex-col items-center py-8">
        <div class="mb-4 flex gap-1">
          <span
            v-for="i in 3"
            :key="i"
            class="h-2 w-2 rounded-full bg-accent-purple animate-bounce"
            :style="{ animationDelay: `${i * 0.15}s` }"
          />
        </div>
        <p class="text-sm text-muted">Gemini กำลังวิเคราะห์เลข {{ number }}...</p>
      </div>

      <Transition name="fade">
        <div v-if="showContent && analysis" class="space-y-5 animate-fade-up">
          <div class="flex items-center gap-4">
            <div class="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" stroke-width="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  :stroke="analysis.luckScore >= 80 ? '#22c55e' : analysis.luckScore >= 60 ? '#f59e0b' : '#9ca3af'"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="`${analysis.luckScore * 2.14} 214`"
                />
              </svg>
              <span class="font-display text-xl font-bold text-gray-900">{{ analysis.luckScore }}</span>
            </div>
            <div>
              <p class="text-xs text-subtle">คะแนนโชค</p>
              <p class="text-lg font-bold text-gray-900">{{ analysis.category }}</p>
              <div class="mt-1 h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full bg-gradient-to-r transition-all duration-1000"
                  :class="scoreColor(analysis.luckScore)"
                  :style="{ width: `${analysis.luckScore}%` }"
                />
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-accent-purple/15 bg-accent-purple/5 p-4">
            <div class="mb-2 flex items-center gap-2">
              <span class="text-xs font-medium text-accent-purple">✨ Gemini สรุป</span>
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-purple" />
            </div>
            <p class="min-h-[1.5rem] text-sm leading-relaxed text-gray-700">
              {{ typedSummary }}<span v-if="isAnalyzing || typedSummary.length < analysis.summary.length" class="animate-pulse text-accent-purple">|</span>
            </p>
          </div>

          <div>
            <p class="mb-2 text-xs font-medium text-muted">🌟 จุดเด่น</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="highlight in analysis.highlights"
                :key="highlight"
                class="rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-700"
              >
                {{ highlight }}
              </span>
            </div>
          </div>

          <div>
            <p class="mb-3 text-xs font-medium text-muted">🔢 ความหมายแต่ละตัว</p>
            <div class="grid gap-2 sm:grid-cols-2">
              <div
                v-for="item in analysis.digitMeanings"
                :key="item.digit + item.meaning"
                class="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-100 font-display text-sm font-bold text-gold-700">
                  {{ item.digit }}
                </span>
                <div class="min-w-0">
                  <p class="text-xs leading-relaxed text-gray-600">{{ item.meaning }}</p>
                  <p class="mt-0.5 text-[10px]" :class="energyColor(item.energy)">
                    พลังงาน: {{ energyLabel(item.energy) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
