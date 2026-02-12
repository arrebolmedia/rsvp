const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const giftRegistry = await prisma.siteSettings.findUnique({
    where: { section: 'giftRegistry' }
  });
  
  console.log('\n=== GIFT REGISTRY ===');
  if (giftRegistry) {
    console.log(JSON.stringify(giftRegistry.content, null, 2));
  } else {
    console.log('No encontrado');
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
