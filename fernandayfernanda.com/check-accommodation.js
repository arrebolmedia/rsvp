const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const accommodation = await prisma.siteSettings.findUnique({
    where: { section: 'accommodation' }
  });
  
  console.log('\n=== ACCOMMODATION ===');
  if (accommodation) {
    console.log(JSON.stringify(accommodation.content, null, 2));
  } else {
    console.log('No encontrado');
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
