const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const s = await prisma.siteSettings.findUnique({ where: { section: 'giftRegistry' } });
  console.log(JSON.stringify(s.content, null, 2));
  await prisma.$disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
