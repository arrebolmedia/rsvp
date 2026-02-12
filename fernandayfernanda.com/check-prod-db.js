const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const sections = ['hero', 'welcome', 'itinerary'];
  
  for (const section of sections) {
    const setting = await prisma.siteSettings.findUnique({
      where: { section }
    });
    
    console.log(`\n=== ${section.toUpperCase()} ===`);
    if (setting) {
      console.log(JSON.stringify(setting.content, null, 2));
    } else {
      console.log('No encontrado');
    }
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
