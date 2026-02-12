const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Eliminar el registro de giftRegistry
  await prisma.siteSettings.delete({
    where: { section: 'giftRegistry' }
  });
  
  console.log('✅ Registro de giftRegistry eliminado');
  
  await prisma.$disconnect();
}

main().catch(console.error);
