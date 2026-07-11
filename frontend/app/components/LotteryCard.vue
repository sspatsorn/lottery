<script setup lang="ts">
import type { LotteryDigitCount } from '~/types/lottery'
import { LOTTERY_TYPE_OPTIONS } from '~/composables/useLottery'

const props = defineProps<{
  selectedType: LotteryDigitCount
  isSpinning: boolean
  currentNumber: string
}>()

const emit = defineEmits<{
  spin: [type: LotteryDigitCount]
  'update:type': [type: LotteryDigitCount]
}>()

const typeOptions = LOTTERY_TYPE_OPTIONS
const { copied, canShare, copyNumber, shareNumber } = useShare()

function selectType(type: LotteryDigitCount) {
  if (!props.isSpinning) {
    emit('update:type', type)
  }
}

function handleSpin() {
  if (!props.isSpinning) {
    emit('spin', props.selectedType)
  }
}

async function handleCopy() {
  if (props.currentNumber) {
    await copyNumber(props.currentNumber)
  }
}

async function handleShare() {
  if (props.currentNumber) {
    await shareNumber(props.currentNumber, props.selectedType)
  }
}

const hasResult = computed(() => !!props.currentNumber && !props.isSpinning)
</script>

<template>
  <div class="glass-card overflow-hidden">
    <div class="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl">
          🎰
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900">สุ่มเลขนำโชค</h2>
          <p class="text-xs text-muted">กดปุ่มเพื่อเริ่มสุ่มเลขมงคล</p>
        </div>
      </div>
    </div>

    <div class="space-y-6 p-5 sm:p-6">
      <div>
        <p class="mb-3 text-sm font-medium text-gray-600">เลือกประเภท</p>
        <div class="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            v-for="option in typeOptions"
            :key="option.value"
            type="button"
            class="type-btn group relative overflow-hidden rounded-xl border p-3 text-center transition-all duration-200 sm:p-4"
            :class="selectedType === option.value
              ? 'border-gold-400 bg-amber-50 shadow-md shadow-amber-100'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'"
            :disabled="isSpinning"
            @click="selectType(option.value)"
          >
            <span class="mb-1 block text-xl sm:text-2xl">{{ option.icon }}</span>
            <span
              class="block text-sm font-semibold"
              :class="selectedType === option.value ? 'text-gold-600' : 'text-gray-700'"
            >
              {{ option.label }}
            </span>
            <span class="mt-0.5 block text-[10px] text-subtle sm:text-xs">{{ option.description }}</span>
          </button>
        </div>
      </div>

      <div
        class="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-b from-amber-50/80 via-white to-gray-50 py-6 sm:py-8"
        :class="{ 'animate-pulse-glow': isSpinning }"
      >
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08),transparent_70%)]" />
        <div class="relative px-3 sm:px-6">
        <SlotMachine
          :digit-count="selectedType"
          :spinning="isSpinning"
          :result="currentNumber"
        />
        </div>
      </div>

      <button
        type="button"
        class="btn-primary w-full py-4 text-base sm:text-lg"
        :disabled="isSpinning"
        @click="handleSpin"
      >
        <span v-if="isSpinning" class="flex items-center justify-center gap-2">
          <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          กำลังสุ่ม...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <span>🍀</span>
          สุ่มเลขเลย!
        </span>
      </button>

      <Transition name="fade">
        <div v-if="hasResult" class="flex gap-2 animate-fade-up">
          <button
            type="button"
            class="btn-secondary flex flex-1 items-center justify-center gap-2"
            @click="handleCopy"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {{ copied ? 'คัดลอกแล้ว!' : 'คัดลอกเลข' }}
          </button>
          <button
            v-if="canShare"
            type="button"
            class="btn-secondary flex flex-1 items-center justify-center gap-2"
            @click="handleShare"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            แชร์
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
