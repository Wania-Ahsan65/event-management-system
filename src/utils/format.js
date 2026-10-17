export function formatDate(localDate) {
  if (!localDate) return 'Date TBA'
  return new Date(`${localDate}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function formatTime(localTime) {
  if (!localTime) return ''
  const [h, m] = localTime.split(':')
  const d = new Date()
  d.setHours(Number(h), Number(m))
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// true if the event date is today or later (events with no date count as upcoming)
export function isUpcoming(localDate) {
  if (!localDate) return true
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return localDate >= todayStr
}