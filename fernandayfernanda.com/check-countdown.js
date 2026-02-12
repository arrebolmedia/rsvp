const now = new Date();
const weddingDate = new Date('2026-08-29T13:00:00-06:00');

const difference = weddingDate.getTime() - now.getTime();

const days = Math.floor(difference / (1000 * 60 * 60 * 24));
const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

console.log(`\n📅 Countdown actual:`);
console.log(`Días: ${days}`);
console.log(`Horas: ${hours}`);
console.log(`Minutos: ${minutes}`);
console.log(`\n⏰ Total: ${days} días, ${hours} horas y ${minutes} minutos`);
console.log(`\nFecha actual: ${now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
console.log(`Fecha de boda: ${weddingDate.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
