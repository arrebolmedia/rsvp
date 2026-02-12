import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Hero Section
  await prisma.siteSettings.upsert({
    where: { section: 'hero' },
    update: {
      content: {
        title: 'Fernanda & Fernanda',
        subtitle: '29 de Agosto 2026',
        weddingDate: '2026-08-29T14:00:00',
        location: 'Xolatlaco, Tepoztlán',
        backgroundImage: '',
        showCountdown: true,
      },
    },
    create: {
      section: 'hero',
      content: {
        title: 'Fernanda & Fernanda',
        subtitle: '29 de Agosto 2026',
        weddingDate: '2026-08-29T14:00:00',
        location: 'Xolatlaco, Tepoztlán',
        backgroundImage: '',
        showCountdown: true,
      },
    },
  })

  // Welcome Message
  await prisma.siteSettings.upsert({
    where: { section: 'welcome' },
    update: {
      content: {
        title: '',
        message: '',
        icon: 'FaHeart',
      },
    },
    create: {
      section: 'welcome',
      content: {
        title: '',
        message: '',
        icon: 'FaHeart',
      },
    },
  })

  // Itinerary
  await prisma.siteSettings.upsert({
    where: { section: 'itinerary' },
    update: {
      content: {
        title: 'Itinerario',
        events: [
          {
            day: 'Sábado 29 de Agosto',
            title: 'BODA',
            description: 'En este rincón místico donde el tiempo parece detenerse y la magia aún respira, hemos decidido unir nuestros caminos para siempre. No podíamos imaginar este nuevo comienzo sin las personas que han sido parte de nuestro viaje; por eso, queremos que nos acompañen a celebrar, a vibrar en sintonía con la naturaleza y a ser testigos de este momento donde nuestro amor se vuelve eterno bajo las montañas.',
            time: 'Ceremonia: 1:00 PM\nCocktail: 2:00 PM\nRecepción: 3:00 PM',
            location: 'XOLATLACO',
            dressCode: 'Vaquero Etiqueta',
            dressCodeLink: 'https://mx.pinterest.com/fernanda0646/dress-code/?invite_code=ada8df7fb247445ebe2d23d243d8dc8e&sender=389772680158547481',
            dressCodeNote: 'NOTA IMPORTANTE: Por favor, evitar el uso de color blanco, que está reservado para las novias.',
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
    create: {
      section: 'itinerary',
      content: {
        title: 'Itinerario',
        events: [
          {
            day: 'Sábado 29 de Agosto',
            title: 'BODA',
            description: 'En este rincón místico donde el tiempo parece detenerse y la magia aún respira, hemos decidido unir nuestros caminos para siempre. No podíamos imaginar este nuevo comienzo sin las personas que han sido parte de nuestro viaje; por eso, queremos que nos acompañen a celebrar, a vibrar en sintonía con la naturaleza y a ser testigos de este momento donde nuestro amor se vuelve eterno bajo las montañas.',
            time: 'Ceremonia: 1:00 PM\nCocktail: 2:00 PM\nRecepción: 3:00 PM',
            location: 'XOLATLACO',
            dressCode: 'Vaquero Etiqueta',
            dressCodeLink: 'https://mx.pinterest.com/fernanda0646/dress-code/?invite_code=ada8df7fb247445ebe2d23d243d8dc8e&sender=389772680158547481',
            dressCodeNote: 'NOTA IMPORTANTE: Por favor, evitar el uso de color blanco, que está reservado para las novias.',
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
  await prisma.siteSettings.upsert({
    where: { section: 'accommodation' },
    update: {
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
            link: 'https://direct-book.com/properties/hotelvallemistico?locale=es',
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
            phone: '5217775357299',
            isWhatsApp: true,
            link: 'https://hotelbuenavibra.com',
          },
        ],
      },
    },
    create: {
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
            link: 'https://direct-book.com/properties/hotelvallemistico?locale=es',
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
            phone: '5217775357299',
            isWhatsApp: true,
            link: 'https://hotelbuenavibra.com',
          },
        ],
      },
    },
  })

  // Gift Registry
  await prisma.siteSettings.upsert({
    where: { section: 'giftRegistry' },
    update: {
      content: {
        title: 'Regalos',
        description: 'Su presencia es el mayor regalo que podemos recibir en este día tan especial. Si desean tener un detalle con nosotras les agradeceremos que lo hagan a través de nuestras cuentas bancarias:',
        accounts: [
          {
            bank: 'BBVA',
            accountNumber: '012180 015155817407',
            accountHolder: 'María Fernanda Jiménez Guadarrama',
          },
          {
            bank: 'BBVA',
            accountNumber: '012180 015011248204',
            accountHolder: 'Fernanda Ávalos Pérez',
          },
        ],
      },
    },
    create: {
      section: 'giftRegistry',
      content: {
        title: 'Regalos',
        description: 'Su presencia es el mayor regalo que podemos recibir en este día tan especial. Si desean tener un detalle con nosotras les agradeceremos que lo hagan a través de nuestras cuentas bancarias:',
        accounts: [
          {
            bank: 'BBVA',
            accountNumber: '012180 015155817407',
            accountHolder: 'María Fernanda Jiménez Guadarrama',
          },
          {
            bank: 'BBVA',
            accountNumber: '012180 015011248204',
            accountHolder: 'Fernanda Ávalos Pérez',
          },
        ],
      },
    },
  })

  // Design Settings
  await prisma.siteSettings.upsert({
    where: { section: 'design' },
    update: {
      content: {
        colors: {
          primary: '#D46B26',
          secondary: '#B87E12',
          accent: '#3D7044',
          background: '#FFFEF9',
          text: '#2B2B2B',
          tertiary: '#FABD2A',
          highlight: '#FF8200',
        },
        fonts: {
          heading: 'Cormorant',
          body: 'Montserrat',
          headingWeight: 300,
          bodyWeight: 300,
        },
      },
    },
    create: {
      section: 'design',
      content: {
        colors: {
          primary: '#D46B26',
          secondary: '#B87E12',
          accent: '#3D7044',
          background: '#FFFEF9',
          text: '#2B2B2B',
          tertiary: '#FABD2A',
          highlight: '#FF8200',
        },
        fonts: {
          heading: 'Cormorant',
          body: 'Montserrat',
          headingWeight: 300,
          bodyWeight: 300,
        },
      },
    },
  })

  console.log('✅ Configuración de Fernanda & Fernanda actualizada')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
