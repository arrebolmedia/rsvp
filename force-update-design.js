const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Actualizar diseño con Cinzel y paleta Terracota
  await prisma.siteSettings.update({
    where: { section: 'design' },
    data: {
      content: {
        heroType: 'classic',
        colors: {
          primary: '#8B4444',
          secondary: '#C87259',
          accent: '#D4AF37',
          text: '#2B2B2B',
          background: '#FAF8F5',
        },
        fonts: {
          heading: 'Cinzel',
          body: 'Montserrat',
        },
        videoUrl: '/videos/hero-video.mp4',
        overlayOpacity: 0.3,
      }
    }
  })
  
  console.log('✅ Diseño actualizado con Cinzel y paleta Terracota & Vino')
  
  const result = await prisma.siteSettings.findUnique({
    where: { section: 'design' }
  })
  console.log(JSON.stringify(result.content, null, 2))
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
  })
