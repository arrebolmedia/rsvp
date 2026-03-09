const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS unaccent`;
  console.log('unaccent extension enabled');
  await prisma.$disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
