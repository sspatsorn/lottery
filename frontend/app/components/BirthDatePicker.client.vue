<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { th } from 'date-fns/locale'
import {
  formatBuddhistInput,
  parseBirthDate,
  toBirthDateString,
} from '~/utils/formatDate'

const model = defineModel<string>({ default: '' })

/** Date ภายใน picker — sync กับ string yyyy-MM-dd */
const pickerDate = ref<Date | null>(null)

watch(
  () => model.value,
  (value) => {
    const parsed = parseBirthDate(value)
    const current = pickerDate.value?.getTime() ?? null
    const next = parsed?.getTime() ?? null
    if (current !== next) {
      pickerDate.value = parsed
    }
  },
  { immediate: true },
)

watch(pickerDate, (value) => {
  const next = value ? toBirthDateString(value) : ''
  if (next !== model.value) {
    model.value = next
  }
})

const maxDate = new Date()

const dateFormats = {
  input: (date: Date) => formatBuddhistInput(date),
  preview: (date: Date) => formatBuddhistInput(date),
}

const BUDDHIST_ERA_OFFSET = 543

function toBuddhistYear(year: number): number {
  return year + BUDDHIST_ERA_OFFSET
}
</script>

<template>
  <VueDatePicker
    v-model="pickerDate"
    :locale="th"
    :formats="dateFormats"
    :time-config="{ enableTimePicker: false }"
    :max-date="maxDate"
    :dark="false"
    :text-input="false"
    auto-apply
    teleport
    clearable
    placeholder="เลือกวันเกิด (พ.ศ.)"
    class="birth-datepicker"
  >
    <template #year="{ value }">
      {{ toBuddhistYear(value) }}
    </template>
    <template #year-overlay-value="{ value }">
      {{ toBuddhistYear(value) }}
    </template>
    <template #calendar-header="{ day, index }">
      <span :class="{ 'text-red-500': index === 5 || index === 6 }">{{ day }}</span>
    </template>
  </VueDatePicker>
</template>

<style>
.birth-datepicker {
  width: 100%;
  --dp-font-family: 'Noto Sans Thai', system-ui, sans-serif;
  --dp-border-radius: 0.75rem;
  --dp-cell-border-radius: 0.5rem;
  --dp-background-color: #ffffff;
  --dp-text-color: #1f2937;
  --dp-hover-color: #f3f4f6;
  --dp-hover-text-color: #1f2937;
  --dp-hover-icon-color: #6b7280;
  --dp-primary-color: #0891b2;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #ecfeff;
  --dp-border-color: #e5e7eb;
  --dp-menu-border-color: #e5e7eb;
  --dp-disabled-color: #f3f4f6;
  --dp-scroll-bar-background: #f3f4f6;
  --dp-scroll-bar-color: #d1d5db;
  --dp-icon-color: #6b7280;
  --dp-danger-color: #ef4444;
  --dp-highlight-color: rgba(8, 145, 178, 0.1);
}

.birth-datepicker .dp__input_wrap {
  cursor: pointer;
}

.birth-datepicker .dp__input {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  background: #ffffff;
  color: #1f2937;
  cursor: pointer;
  caret-color: transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.birth-datepicker .dp__input:hover {
  border-color: #d1d5db;
}

.birth-datepicker .dp__input:focus {
  border-color: #0891b2;
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.15);
}

.birth-datepicker .dp__menu {
  border-radius: 0.75rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  z-index: 100;
}

.birth-datepicker .dp__active_date {
  background: #0891b2;
}

.birth-datepicker .dp__today {
  border-color: #f59e0b;
}

.birth-datepicker .dp__input_icon {
  cursor: pointer;
}
</style>
