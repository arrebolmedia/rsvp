const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const design = await prisma.siteSettings.findUnique({
    where: { section: 'design' }
  })
  
  if (design) {
    design.content.fonts.bodyWeight = 100
    
    await prisma.siteSettings.update({
      where: { section: 'design' },
      data: { content: design.content }
    })
    
    console.log('✓ bodyWeight agregado con valor 100')
    console.log('Fonts:', JSON.stringify(design.content.fonts, null, 2))
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
