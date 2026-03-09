// Beräknar hur lång tid som är kvar på en auktion och returnerar en läsbar sträng
// Returnerar "Avslutad" om auktionen redan är slut
export function getTimeLeft(endDateUtc: string): string {
  const now = Date.now()
  const end = new Date(endDateUtc).getTime()
  const diffMs = end - now

  if (diffMs <= 0) return 'Avslutad'

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // Returnerar den mest relevanta tidsenheten (dagar, timmar, minuter eller sekunder)
  if (days > 0) return `${days} dag${days > 1 ? 'ar' : ''}`
  if (hours > 0) return `${hours} tim`
  if (minutes > 0) return `${minutes} min`
  return `${seconds} sek`
}

// Formaterar ett datum till svensk standard (ÅÅÅÅ-MM-DD HH:MM)
export function FormatDate(dateTime: string): string {
  return new Date(dateTime).toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
