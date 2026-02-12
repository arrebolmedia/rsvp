const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.delete({
    where: { section: 'accommodation' }
  });
  
  console.log('✅ Registro de accommodation eliminado');
  
  await prisma.$disconnect();
}

main().catch(console.error);
