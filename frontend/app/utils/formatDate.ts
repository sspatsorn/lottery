/** แปลงวันที่เป็นรูปแบบไทย พ.ศ. (ปฏิทินพุทธศักราช) */
export function formatThaiBuddhistDate(
  input: Date | number | string,
  options: { includeTime?: boolean } = { includeTime: true },
): string {
  const date = input instanceof Date ? input : parseBirthDate(String(input)) ?? new Date(input)
  if (Number.isNaN(date.getTime())) return ''

  const parts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    calendar: 'buddhist',
  }

  if (options.includeTime) {
    parts.hour = '2-digit'
    parts.minute = '2-digit'
    parts.hour12 = false
  }

  return new Intl.DateTimeFormat('th-TH', parts).format(date)
}

/** แปลง YYYY-MM-DD เป็น Date แบบ local (ไม่มีปัญหา timezone) */
export function parseBirthDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  if (!match) return null
  const [, y, m, d] = match
  return new Date(Number(y), Number(m) - 1, Number(d))
}

/** แปลง Date เป็น YYYY-MM-DD */
export function toBirthDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** แสดงวันที่ใน input แบบ พ.ศ. */
export function formatBuddhistInput(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = (date.getFullYear() + 543).toString()
  return `${day}/${month}/${year}`
}

/** แปลงวันเกิด (YYYY-MM-DD) เป็นข้อความไทย พ.ศ. */
export function formatBirthDateThai(dateStr: string): string {
  if (!dateStr) return ''
  const date = parseBirthDate(dateStr)
  if (!date) return ''
  return formatThaiBuddhistDate(date, { includeTime: false })
}
