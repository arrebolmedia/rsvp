const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteItinerary() {
  console.log('🗑️ Eliminando itinerario...');
  
  await prisma.siteSettings.delete({
    where: { section: 'itinerary' },
  });
  
  console.log('✅ Itinerario eliminado');
  await prisma.$disconnect();
}

deleteItinerary();
