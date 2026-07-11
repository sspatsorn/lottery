<script setup lang="ts">
import type { HistoryEntry } from '~/types/lottery'
import { formatThaiBuddhistDate } from '~/utils/formatDate'

defineProps<{
  entries: HistoryEntry[]
}>()

const emit = defineEmits<{
  remove: [id: string]
  clear: []
  select: [number: string]
}>()

function typeLabel(count: number): string {
  return `${count} ตัว`
}

function typeBadgeClass(count: number): string {
  const map: Record<number, string> = {
    2: 'bg-cyan-50 text-accent-cyan',
    3: 'bg-purple-50 text-accent-purple',
    6: 'bg-amber-50 text-gold-600',
  }
  return map[count] ?? 'bg-gray-100 text-gray-500'
}
</script>

<template>
  <div class="glass-card overflow-hidden">
    <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg">
          📜
        </div>
        <div>
          <h2 class="section-title">ประวัติการสุ่ม</h2>
          <p class="text-xs text-muted">{{ entries.length }} รายการ</p>
        </div>
      </div>
      <button
        v-if="entries.length > 0"
        type="button"
        class="rounded-lg px-3 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50"
        @click="emit('clear')"
      >
        ลบทั้งหมด
      </button>
    </div>

    <div class="max-h-80 overflow-y-auto p-3 sm:max-h-96">
      <div
        v-if="entries.length === 0"
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <span class="mb-3 text-4xl opacity-40">🎲</span>
        <p class="text-sm text-muted">ยังไม่มีประวัติการสุ่ม</p>
        <p class="mt-1 text-xs text-subtle">สุ่มเลขครั้งแรกเพื่อเริ่มบันทึก</p>
      </div>

      <TransitionGroup
        v-else
        name="list"
        tag="ul"
        class="space-y-2"
      >
        <li
          v-for="entry in entries"
          :key="entry.id"
          class="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-gray-200 hover:bg-white"
        >
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center gap-3 text-left"
            @click="emit('select', entry.number)"
          >
            <span class="font-display text-lg font-bold tracking-wider text-gold-600 tabular-nums sm:text-xl">
              {{ entry.number }}
            </span>
            <span
              class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs"
              :class="typeBadgeClass(entry.digitCount)"
            >
              {{ typeLabel(entry.digitCount) }}
            </span>
          </button>

          <div class="shrink-0 text-right">
            <p class="text-[10px] text-subtle sm:text-xs">
              {{ formatThaiBuddhistDate(entry.timestamp) }}
            </p>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-lg p-1.5 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            aria-label="ลบรายการ"
            @click="emit('remove', entry.id)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>
