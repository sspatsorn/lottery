import type { HistoryEntry, LotteryDigitCount } from '~/types/lottery'

const STORAGE_KEY = 'lucky-lottery-history'
const MAX_HISTORY = 50

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadFromStorage(): HistoryEntry[] {
  if (!import.meta.client) return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as HistoryEntry[]
    return Array.isArray(parsed) ? parsed : []
  }
  catch {
    return []
  }
}

function saveToStorage(entries: HistoryEntry[]): void {
  if (!import.meta.client) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function useHistory() {
  const entries = ref<HistoryEntry[]>([])

  /** โหลดประวัติจาก LocalStorage เมื่อ mount */
  function loadHistory() {
    entries.value = loadFromStorage()
  }

  function addEntry(number: string, digitCount: LotteryDigitCount) {
    const entry: HistoryEntry = {
      id: generateId(),
      number,
      digitCount,
      timestamp: Date.now(),
    }

    entries.value = [entry, ...entries.value].slice(0, MAX_HISTORY)
    saveToStorage(entries.value)
    return entry
  }

  function removeEntry(id: string) {
    entries.value = entries.value.filter((e) => e.id !== id)
    saveToStorage(entries.value)
  }

  function clearHistory() {
    entries.value = []
    saveToStorage([])
  }

  onMounted(() => {
    loadHistory()
  })

  return {
    entries,
    addEntry,
    removeEntry,
    clearHistory,
    loadHistory,
  }
}
