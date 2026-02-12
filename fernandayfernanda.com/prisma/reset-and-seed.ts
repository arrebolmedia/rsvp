import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete all existing settings
  await prisma.siteSettings.deleteMany({})
  
  console.log('🗑️  Datos anteriores eliminados')
  
  // Hero Section
  await prisma.siteSettings.create({
    data: {
      section: 'hero',
      content: {
        title: 'Fernanda & Fernanda',
        subtitle: '30 de Agosto 2026',
        weddingDate: '2026-08-30T14:00:00',
        location: 'Xolatlaco, Tepoztlán',
        backgroundImage: '/images/hero/Sin-título-1.jpg',
        showCountdown: true,
      },
    },
  })

  // Welcome Message
  await prisma.siteSettings.create({
    data: {
      section: 'welcome',
      content: {
        title: 'XOLATLACO TEPOZTLÁN',
        message: 'Bajo la mirada de los guardianes de piedra que custodian el valle, encajado entre acantilados y bosques que susurran antiguas profecías, se alza un lugar donde el tiempo parece detenerse: Tepoztlán.\n\nEste valle no es solo un paisaje de montañas; es un altar vivo que resguarda el origen de una leyenda milenaria. Aquí, según cuentan las crónicas del tiempo, nació el soplo que transformó el mundo. En este rincón sagrado, la tierra emite una vibración que trasciende lo visible, donde el magnetismo de sus rocas y la pureza de su aire han servido de refugio para buscadores de lo eterno durante siglos.\n\nTepoztlán no es solo un pueblo rodeado de cerros. Es un relicario de la memoria del mundo. Un lugar donde la magia aún respira y donde cada amanecer recuerda el principio de todo.',
        icon: 'FaHeart',
      },
    },
  })

  // Itinerary Section
  await prisma.siteSettings.create({
    data: {
      section: 'itinerary',
      content: {
        title: 'Itinerario',
        events: [
          {
            day: 'Viernes 29 de Agosto',
            title: 'EL ENCUENTRO',
            description: 'Nuestra historia comienza con la calma del valle. Tras su llegada, los invitamos a relajarse y disfrutar de la atmósfera de Tepoztlán. Estaremos compartiendo la tarde en Xolatlaco, el bar del hotel estará abierto a la carta para todos aquellos que deseen acompañarnos, disfrutar de un par de drinks.',
            time: '6:00 PM - 10:00 PM',
            location: 'XOLATLACO',
            dressCode: 'Casual',
            icon: 'FaCalendarAlt',
          },
          {
            day: 'Sábado 30 de Agosto',
            title: 'BODA',
            description: 'El día más especial',
            time: 'Ceremonia: 2:00 PM\nCocktail: 3:00 PM\nRecepción: 4:00 PM',
            location: 'XOLATLACO',
            dressCode: 'Vaquero Etiqueta',
            dressCodeLink: 'https://mx.pinterest.com/fernanda0646/dress-code/?invite_code=ada8df7fb247445ebe2d23d243d8dc8e&sender=389772680158547481',
            icon: 'FaRing',
          },
          {
            day: 'Domingo 31 de Agosto',
            title: 'CALOR Y ALTAS MONTAÑAS',
            description: '¡Recuperemos energías juntos! Los invitamos a compartir del último día en Hotel Xolatlaco, el lugar ofrecerá su servicio de brunch y bar, disponible para el consumo de cada invitado.\n\nUNA ESTANCIA MÁS LARGA...\nPara aquellos que busquen una desconexión total y deseen disfrutar del calor y la magia de Tepoztlán por un poco más de tiempo, son más que bienvenidos a extender su estancia hasta el día lunes. Nos encantará aprovechar con ustedes al máximo de este rincón sagrado.',
            time: '11:00 AM',
            location: 'HOTEL XOLATLACO',
            dressCode: 'Traje de baño',
            icon: 'FaSun',
          },
        ],
      },
    },
  })

  // Accommodation
  await prisma.siteSettings.create({
    data: {
      section: 'accommodation',
      content: {
        title: 'Sugerencias de Viaje',
        description: '',
        hotels: [
          {
            name: 'Hotel Xolatlaco',
            description: 'Sede del evento',
            phone: '7393951123',
            code: 'Boda de Fernanda y Fernanda',
            link: 'https://www.xolatlaco.com',
          },
          {
            name: 'Hotel Casa Bugambilia',
            description: '10 min',
            phone: '7393954229',
            link: 'https://www.casabugambilia.com',
          },
          {
            name: 'Hotel Casa Valle Místico',
            description: '3 min',
            link: 'https://www.hotelvallemistico.com',
          },
          {
            name: 'Hotel Posada del Valle',
            description: '10 min',
            phone: '7393951947',
            link: 'https://www.laposadadelvalle.com',
          },
          {
            name: 'La Buena Vibra',
            description: '10 min',
            link: 'https://hotelbuenavibra.com',
          },
        ],
      },
    },
  })

  // Gift Registry
  await prisma.siteSettings.create({
    data: {
      section: 'giftRegistry',
      content: {
        title: 'Mesa de Regalos',
        description: 'Cuentas:',
        accounts: [
          {
            bank: 'BBVA',
            name: 'María Fernanda Ruiz Mani',
            account: '012180 015155817407',
          },
          {
            bank: 'BBVA',
            name: 'Fernanda Avalos García',
            account: 'Pendiente',
          },
        ],
      },
    },
  })

  // Dress Code
  await prisma.siteSettings.create({
    data: {
      section: 'dressCode',
      content: {
        title: 'Código de Vestimenta',
        description: 'Vaquero Etiqueta',
        details: 'Una combinación de elegancia y comodidad. Sugerimos vestimenta semiformal con toques campestres.',
        icon: 'GiBoots',
      },
    },
  })

  // Design Settings
  await prisma.siteSettings.create({
    data: {
      section: 'design',
      content: {
        colors: {
          primary: '#D46B26',
          secondary: '#B87E12',
          accent: '#3D7044',
          tertiary: '#FABD2A',
        },
        fonts: {
          heading: 'Cormorant',
          body: 'Montserrat',
        },
      },
    },
  })

  console.log('✅ Configuración de Fernanda & Fernanda actualizada correctamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
