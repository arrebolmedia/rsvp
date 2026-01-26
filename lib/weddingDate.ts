// Zona horaria de México
export const MEXICO_TIMEZONE = 'America/Mexico_City'

// Fecha central de la boda - IMPORTANTE: Esta fecha está en horario de México (CST/CDT)
// Formato ISO con zona horaria explícita para México (UTC-6)
export const WEDDING_DATE = new Date('2026-06-15T17:00:00-06:00')

// Formato de fecha para el hero
export const getFormattedWeddingDate = () => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    timeZone: MEXICO_TIMEZONE
  }
  return WEDDING_DATE.toLocaleDateString('es-MX', options)
}

// Formato corto para el hero (solo "15 de Junio, 2026")
export const getShortWeddingDate = () => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: MEXICO_TIMEZONE
  }
  const formatter = new Intl.DateTimeFormat('es-MX', options)
  const parts = formatter.formatToParts(WEDDING_DATE)
  
  const day = parts.find(p => p.type === 'day')?.value
  const month = parts.find(p => p.type === 'month')?.value
  const year = parts.find(p => p.type === 'year')?.value
  
  return `${day} de ${month}, ${year}`
}
