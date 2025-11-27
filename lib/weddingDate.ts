// Fecha central de la boda - cambiar aquí para actualizar en todo el sitio
export const WEDDING_DATE = new Date('2026-06-15T17:00:00')

// Formato de fecha para el hero
export const getFormattedWeddingDate = () => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }
  return WEDDING_DATE.toLocaleDateString('es-ES', options)
}

// Formato corto para el hero (solo "15 de Junio, 2026")
export const getShortWeddingDate = () => {
  const day = WEDDING_DATE.getDate()
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  const month = months[WEDDING_DATE.getMonth()]
  const year = WEDDING_DATE.getFullYear()
  
  return `${day} de ${month}, ${year}`
}
