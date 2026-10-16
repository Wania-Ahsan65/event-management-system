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