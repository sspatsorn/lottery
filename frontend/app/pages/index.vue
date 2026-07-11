<script setup lang="ts">
import type { LotteryDigitCount } from '~/types/lottery'

const { selectedType, isSpinning, currentNumber, spin, setType } = useLottery()
const { entries, addEntry, removeEntry, clearHistory } = useHistory()

const activeSection = ref<'lottery' | 'birthday' | 'history'>('lottery')
const showClearConfirm = ref(false)

async function handleSpin(type: LotteryDigitCount) {
  setType(type)
  const result = await spin(type)
  addEntry(result, type)
}

function handleHistorySelect(number: string) {
  currentNumber.value = number
  activeSection.value = 'lottery'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleLuckyNumber(number: string, digitCount: LotteryDigitCount) {
  currentNumber.value = number
  setType(digitCount)
}

function confirmClear() {
  clearHistory()
  showClearConfirm.value = false
}

const sections = [
  { id: 'lottery' as const, label: 'สุ่มเลข', icon: '🎰' },
  { id: 'birthday' as const, label: 'วันเกิด', icon: '🎂' },
  { id: 'history' as const, label: 'ประวัติ', icon: '📜' },
]
</script>

<template>
  <div class="min-h-dvh pb-24">
    <header class="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-lg items-center justify-between px-4 py-3 sm:max-w-2xl sm:px-6 lg:max-w-4xl">
        <div class="flex items-center gap-2.5">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-purple-100 text-lg">
            🍀
          </div>
          <div>
            <h1 class="text-base font-bold gradient-text sm:text-lg">สุ่มเลขนำโชค</h1>
            <p class="text-[10px] text-subtle sm:text-xs">Lucky Number Generator</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          <span class="text-[10px] text-muted sm:text-xs">Gemini AI</span>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-lg px-4 py-5 sm:max-w-2xl sm:px-6 sm:py-8 lg:max-w-4xl">
      <section v-show="activeSection === 'lottery'" class="space-y-5">
        <LotteryCard
          :selected-type="selectedType"
          :is-spinning="isSpinning"
          :current-number="currentNumber"
          @spin="handleSpin"
          @update:type="setType"
        />
        <AiAnalysis :number="currentNumber" />
      </section>

      <section v-show="activeSection === 'birthday'">
        <LuckyBirthday @lucky-number="handleLuckyNumber" />
      </section>

      <section v-show="activeSection === 'history'">
        <HistoryList
          :entries="entries"
          @remove="removeEntry"
          @clear="showClearConfirm = true"
          @select="handleHistorySelect"
        />
      </section>
    </main>

    <nav class="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-xl safe-bottom">
      <div class="mx-auto flex max-w-lg items-stretch sm:max-w-2xl lg:max-w-4xl">
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-colors"
          :class="activeSection === section.id
            ? 'text-gold-600'
            : 'text-gray-400 hover:text-gray-600'"
          @click="activeSection = section.id"
        >
          <span class="text-xl">{{ section.icon }}</span>
          <span class="text-[10px] font-medium sm:text-xs">{{ section.label }}</span>
          <span
            v-if="activeSection === section.id"
            class="mt-0.5 h-0.5 w-6 rounded-full bg-gold-500"
          />
        </button>
      </div>
    </nav>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showClearConfirm"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          @click.self="showClearConfirm = false"
        >
          <div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3 class="mb-2 text-lg font-bold text-gray-900">ลบประวัติทั้งหมด?</h3>
            <p class="mb-6 text-sm text-muted">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            <div class="flex gap-3">
              <button
                type="button"
                class="btn-secondary flex-1"
                @click="showClearConfirm = false"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                class="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-600"
                @click="confirmClear"
              >
                ลบทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div {
  transform: scale(0.95);
}
</style>
