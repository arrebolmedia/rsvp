const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const current = await prisma.siteSettings.findUnique({ where: { section: 'itinerary' } });
  const content = current.content;
  const domingo = content.events[1];
  console.log('Before:', domingo.dressCode);
  domingo.dressCode = 'Libre/Traje de baño';
  await prisma.siteSettings.update({ where: { section: 'itinerary' }, data: { content } });
  console.log('After:', content.events[1].dressCode);
  await prisma.$disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
