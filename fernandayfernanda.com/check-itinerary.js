const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkItinerary() {
  console.log('🔍 Verificando itinerario...\n');
  
  const itinerary = await prisma.siteSettings.findUnique({
    where: { section: 'itinerary' },
  });
  
  if (itinerary) {
    console.log('Contenido del itinerario:');
    console.log(JSON.stringify(itinerary.content, null, 2));
    
    if (itinerary.content && itinerary.content.events) {
      const saturday = itinerary.content.events.find(e => e.day.includes('29'));
      if (saturday) {
        console.log('\n📅 Evento del sábado 29:');
        console.log('Descripción:', saturday.description);
        console.log('Longitud:', saturday.description?.length || 0, 'caracteres');
      }
    }
  } else {
    console.log('❌ No se encontró el itinerario');
  }
  
  await prisma.$disconnect();
}

checkItinerary();
