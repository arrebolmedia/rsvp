const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const design = await prisma.siteSettings.findFirst({
    where: { section: 'design' }
  })
  
  console.log('Design settings:', JSON.stringify(design?.content, null, 2))
}

main()
  .finally(() => prisma.$disconnect())
