import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Hero
  await prisma.siteSettings.upsert({
    where: { section: 'hero' },
    update: {},
    create: {
      section: 'hero',
      content: {
        slides: [
          { id: 1, image: '/images/hero/5.jpg', alt: 'Pareja de novios' },
          { id: 2, image: '/images/hero/10.jpg', alt: 'Momento romántico' },
          { id: 3, image: '/images/hero/24.jpg', alt: 'Celebración' },
          { id: 4, image: '/images/hero/28.jpg', alt: 'Juntos' },
        ],
        weddingDate: '2026-06-15T17:00:00',
      },
    },
  })

  // Welcome
  await prisma.siteSettings.upsert({
    where: { section: 'welcome' },
    update: {},
    create: {
      section: 'welcome',
      content: {
        title: 'Nos Casamos',
        message1: 'Nos complace invitarte a celebrar uno de los días más especiales de nuestras vidas.',
        message2: 'Después de años de amor y complicidad, hemos decidido dar el siguiente paso en nuestra historia juntos. Queremos compartir este momento único contigo y con las personas que más queremos.',
      },
    },
  })

  // Countdown
  await prisma.siteSettings.upsert({
    where: { section: 'countdown' },
    update: {},
    create: {
      section: 'countdown',
      content: {
        title: 'Cuenta Regresiva',
        targetDate: '2026-06-15T17:00:00',
      },
    },
  })

  // Itinerary
  await prisma.siteSettings.upsert({
    where: { section: 'itinerary' },
    update: {},
    create: {
      section: 'itinerary',
      content: {
        title: 'Itinerario',
        events: [
          { icon: 'FaChurch', time: '16:00', title: 'Ceremonia Religiosa', location: 'Parroquia San José', description: 'Av. Principal 123, Ciudad' },
          { icon: 'FaGlassCheers', time: '18:00', title: 'Cóctel de Bienvenida', location: 'Jardín del Salón', description: 'Recepción con aperitivos y bebidas' },
          { icon: 'FaUtensils', time: '19:30', title: 'Cena', location: 'Salón Principal', description: 'Menú especial preparado para la ocasión' },
          { icon: 'FaMusic', time: '21:00', title: 'Fiesta', location: 'Pista de Baile', description: '¡A bailar hasta el amanecer!' },
        ],
      },
    },
  })

  // Gallery
  await prisma.siteSettings.upsert({
    where: { section: 'gallery' },
    update: {},
    create: {
      section: 'gallery',
      content: {
        title: 'Nuestra Historia',
        photos: [
          { id: 1, src: '/images/gallery/2.jpg', alt: 'Foto 2', height: 'h-80' },
          { id: 2, src: '/images/gallery/5.jpg', alt: 'Foto 5', height: 'h-64' },
          { id: 3, src: '/images/gallery/10.jpg', alt: 'Foto 10', height: 'h-72' },
          { id: 4, src: '/images/gallery/13.jpg', alt: 'Foto 13', height: 'h-96' },
          { id: 5, src: '/images/gallery/14.jpg', alt: 'Foto 14', height: 'h-64' },
          { id: 6, src: '/images/gallery/17.jpg', alt: 'Foto 17', height: 'h-80' },
          { id: 7, src: '/images/gallery/20.jpg', alt: 'Foto 20', height: 'h-72' },
          { id: 8, src: '/images/gallery/24.jpg', alt: 'Foto 24', height: 'h-64' },
          { id: 9, src: '/images/gallery/25.jpg', alt: 'Foto 25', height: 'h-80' },
          { id: 10, src: '/images/gallery/28.jpg', alt: 'Foto 28', height: 'h-72' },
        ],
      },
    },
  })

  // Accommodation
  await prisma.siteSettings.upsert({
    where: { section: 'accommodation' },
    update: {},
    create: {
      section: 'accommodation',
      content: {
        title: 'Hospedaje',
        description: 'Para nosotros es muy importante tu seguridad, estos son los lugares que recomendamos para tu instalación.',
        hotels: [
          { name: 'HOSTERÍA LAS QUINTAS', code: '27BAYR', address: 'Blvd. Gustavo Díaz Ordaz 9, Cantarranas, 62448 Cuernavaca, Mor.', phone: '777 318 3949', url: '#' },
          { name: 'FLOR DE MAYO', code: 'AndreaPamela & Rodrigo', address: 'Matamoros 603, Cuernavaca Centro, Centro, 62000 Cuernavaca, Mor.', phone: '777 312 1202', url: '#' },
          { name: 'HOTEL CASA AZUL', code: 'Andrea & Rodrigo', address: 'Gral. Mariano Arista 17, Cuernavaca Centro, Centro, 62000 Cuernavaca, Mor.', phone: '777 314 2141', url: '#' },
          { name: 'FIESTA INN CUERNAVACA', code: 'Boda Pam y Ro', address: 'Carretera México - Acapulco Km 88 S/N, Delicias, 62330 Cuernavaca, Mor.', phone: '777 100 8200', url: '#' },
          { name: 'FIESTA AMERICANA SAN ANTONIO EL PUENTE', code: 'Boda Pam y Ro', address: 'Reforma 2 Fracc, Real del Puente, 62790 Xochitepec, Mor.', phone: '777 362 0770', url: '#' },
          { name: 'HOTEL GRAND FIESTA AMERICANA SUMIYA', code: 'Boda Pam y Ro', address: 'Fraccionamiento Sumiya S/N, Jose G. Parres, 62564 Jiutepec, Mor.', phone: '443 310 8137', url: '#' },
        ],
      },
    },
  })

  // Gift Registry
  await prisma.siteSettings.upsert({
    where: { section: 'giftRegistry' },
    update: {},
    create: {
      section: 'giftRegistry',
      content: {
        title: 'Mesa de Regalos',
        description: 'Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo, hemos preparado estas opciones:',
        registries: [
          { name: 'Liverpool', description: 'Mesa de regalos', link: 'https://mesaderegalos.liverpool.com.mx', eventNumber: '12345678' },
          { name: 'Amazon', description: 'Lista de deseos', link: 'https://www.amazon.com.mx/wedding', eventNumber: 'ABCD1234' },
        ],
      },
    },
  })

  // Footer
  await prisma.siteSettings.upsert({
    where: { section: 'footer' },
    update: {},
    create: {
      section: 'footer',
      content: {
        text: '© 2025 | Arrebol Weddings',
      },
    },
  })

  console.log('Site settings seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
