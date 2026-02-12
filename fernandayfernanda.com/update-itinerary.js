const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateItinerary() {
  console.log('🔄 Actualizando descripción del itinerario...');
  
  const itinerary = await prisma.siteSettings.findUnique({
    where: { section: 'itinerary' },
  });
  
  if (!itinerary) {
    console.log('❌ No se encontró el itinerario');
    await prisma.$disconnect();
    return;
  }
  
  // Actualizar la descripción del sábado 29
  itinerary.content.events[0].description = 'En este rincón místico donde el tiempo parece detenerse y la magia aún respira, hemos decidido unir nuestros caminos para siempre. No podíamos imaginar este nuevo comienzo sin las personas que han sido parte de nuestro viaje; por eso, queremos que nos acompañen a celebrar, a vibrar en sintonía con la naturaleza y a ser testigos de este momento donde nuestro amor se vuelve eterno bajo las montañas.';
  
  await prisma.siteSettings.update({
    where: { section: 'itinerary' },
    data: {
      content: itinerary.content,
    },
  });
  
  console.log('✅ Descripción del itinerario actualizada');
  await prisma.$disconnect();
}

updateItinerary();
