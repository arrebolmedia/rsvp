const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.update({
    where: { section: 'accommodation' },
    data: {
      content: {
        title: 'Sugerencias de Viaje',
        description: '',
        hotels: [
          {
            name: 'Hotel Xolatlaco',
            description: 'Sede del evento',
            phone: '7393951123',
            code: 'Boda de Fernanda y Fernanda',
            link: 'https://www.xolatlaco.com',
          },
          {
            name: 'Hotel Casa Bugambilia',
            description: '10 min',
            phone: '7393954229',
            link: 'https://www.casabugambilia.com',
          },
          {
            name: 'Hotel Casa Valle Místico',
            description: '3 min',
            link: 'https://direct-book.com/properties/hotelvallemistico?locale=es',
          },
          {
            name: 'Hotel Posada del Valle',
            description: '10 min',
            phone: '7393951947',
            link: 'https://www.laposadadelvalle.com',
          },
          {
            name: 'La Buena Vibra',
            description: '10 min',
            phone: '5217775357299',
            isWhatsApp: true,
            link: 'https://hotelbuenavibra.com',
          },
        ],
      },
    },
  });
  
  console.log('✅ Accommodation actualizado');
  
  await prisma.$disconnect();
}

main().catch(console.error);
