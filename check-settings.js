const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const design = await prisma.siteSettings.findUnique({
    where: { section: 'design' }
  })
  
  console.log('=== DESIGN SETTINGS ===')
  console.log(JSON.stringify(design?.content, null, 2))
  
  const hero = await prisma.siteSettings.findUnique({
    where: { section: 'hero' }
  })
  
  console.log('\n=== HERO SETTINGS ===')
  console.log(JSON.stringify(hero?.content, null, 2))
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
  })
