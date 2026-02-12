const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  const hero = await prisma.siteSettings.findUnique({
    where: { section: 'hero' }
  })
  console.log('Hero settings:', JSON.stringify(hero, null, 2))
  await prisma.$disconnect()
}

check()
