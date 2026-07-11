<script setup lang="ts">
import type { LotteryDigitCount } from '~/types/lottery'
import { formatBirthDateThai } from '~/utils/formatDate'

const emit = defineEmits<{
  'lucky-number': [number: string, digitCount: LotteryDigitCount]
}>()

const { birthDate, result, isCalculating, calculate } = useLucky()

const selectedDigits = ref<LotteryDigitCount>(6)

const digitOptions: { value: LotteryDigitCount, label: string }[] = [
  { value: 2, label: '2 ตัว' },
  { value: 3, label: '3 ตัว' },
  { value: 6, label: '6 ตัว' },
]

const birthDateThai = computed(() => formatBirthDateThai(birthDate.value))

async function handleCalculate() {
  if (!birthDate.value) return
  const res = await calculate(selectedDigits.value)
  if (res) {
    emit('lucky-number', res.luckyNumber, res.digitCount)
  }
}

const elementEmoji: Record<string, string> = {
  ไฟ: '🔥',
  น้ำ: '💧',
  ลม: '🌬️',
  ดิน: '🌍',
  ทอง: '✨',
}
</script>

<template>
  <div class="glass-card overflow-hidden">
    <div class="border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-purple-50 px-5 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-xl">
          🎂
        </div>
        <div>
          <h2 class="section-title">เลขมงคลวันเกิด</h2>
          <p class="text-xs text-muted">วิเคราะห์ด้วย Gemini AI จากวันเกิดของคุณ</p>
        </div>
      </div>
    </div>

    <div class="space-y-5 p-5 sm:p-6">
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-600">วันเกิดของคุณ (พ.ศ.)</label>
        <BirthDatePicker v-model="birthDate" />
        <p v-if="birthDate && birthDateThai" class="mt-1.5 text-xs text-accent-cyan">
          📅 {{ birthDateThai }}
        </p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-gray-600">จำนวนหลัก</label>
        <div class="flex gap-2">
          <button
            v-for="opt in digitOptions"
            :key="opt.value"
            type="button"
            class="flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all"
            :class="selectedDigits === opt.value
              ? 'border-accent-cyan bg-cyan-50 text-accent-cyan'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'"
            @click="selectedDigits = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <button
        type="button"
        class="btn-primary w-full"
        :disabled="!birthDate || isCalculating"
        @click="handleCalculate"
      >
        <span v-if="isCalculating" class="flex items-center justify-center gap-2">
          <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Gemini กำลังวิเคราะห์...
        </span>
        <span v-else>🔮 วิเคราะห์เลขมงคล</span>
      </button>

      <Transition name="fade">
        <div v-if="result" class="space-y-4 rounded-2xl border border-cyan-100 bg-cyan-50/50 p-5 animate-fade-up">
          <div class="text-center">
            <p class="mb-1 text-xs text-muted">เลขมงคลของคุณ</p>
            <p class="font-display text-3xl font-bold tracking-widest text-accent-cyan tabular-nums sm:text-4xl">
              {{ result.luckyNumber }}
            </p>
            <p class="mt-2 text-sm text-muted">
              {{ elementEmoji[result.element] }} ธาตุ{{ result.element }}
            </p>
          </div>

          <div class="rounded-xl bg-white p-4 shadow-sm">
            <p class="mb-2 text-xs font-medium text-muted">🔮 คำทำนาย</p>
            <p class="text-sm leading-relaxed text-gray-700">{{ result.prediction }}</p>
          </div>

          <div>
            <p class="mb-2 text-xs font-medium text-muted">✨ ลักษณะเด่น</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="trait in result.traits"
                :key="trait"
                class="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600"
              >
                {{ trait }}
              </span>
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
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
