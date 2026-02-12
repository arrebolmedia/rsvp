const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const design = await prisma.siteSettings.findUnique({
    where: { section: 'design' }
  })
  
  if (design) {
    console.log('Design Settings:')
    console.log(JSON.stringify(design.content, null, 2))
  } else {
    console.log('No design settings found')
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
