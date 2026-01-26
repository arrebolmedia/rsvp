import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Default settings data (same as seed-settings.ts)
// IMPORTANTE: Todas las fechas usan zona horaria de México (CST/CDT: -06:00)
const defaultSettings: Record<string, any> = {
  hero: {
    weddingDate: '2026-06-20T18:00:00-06:00',
    slides: [
      { id: 1, image: '/images/hero/1.jpg', alt: 'Romantic sunset couple' },
      { id: 2, image: '/images/hero/2.jpg', alt: 'Wedding venue' },
      { id: 3, image: '/images/hero/3.jpg', alt: 'Couple portrait' },
      { id: 4, image: '/images/hero/4.jpg', alt: 'Outdoor ceremony' },
      { id: 5, image: '/images/hero/5.jpg', alt: 'Wedding celebration' },
    ],
  },
  welcome: {
    title: '¡Bienvenidos a Nuestra Boda!',
    message1: 'Con gran alegría los invitamos a celebrar nuestro amor y el comienzo de nuestra vida juntos.',
    message2: 'Será un honor contar con su presencia en este día tan especial para nosotros.',
  },
  countdown: {
    title: 'Faltan...',
    targetDate: '2026-06-20T18:00:00-06:00',
  },
  itinerary: {
    title: 'Itinerario del Día',
    events: [
      {
        icon: 'FaChurch',
        time: '18:00',
        title: 'Ceremonia Religiosa',
        location: 'Iglesia de San Miguel',
        description: 'La ceremonia comenzará puntualmente a las 6:00 PM.',
      },
      {
        icon: 'FaCamera',
        time: '19:30',
        title: 'Sesión de Fotos',
        location: 'Jardines del Palacio',
        description: 'Después de la ceremonia, tendremos una sesión de fotos con nuestros invitados.',
      },
      {
        icon: 'FaUtensils',
        time: '20:00',
        title: 'Recepción y Cena',
        location: 'Hacienda Los Álamos',
        description: 'Disfrutaremos de una deliciosa cena y celebración.',
      },
      {
        icon: 'FaMusic',
        time: '22:00',
        title: 'Fiesta y Baile',
        location: 'Salón Principal',
        description: '¡A bailar toda la noche!',
      },
    ],
  },
  gallery: {
    title: 'Nuestra Historia',
    photos: [
      { id: 1, src: '/images/gallery/1.jpg', alt: 'Primer encuentro', height: 'tall' },
      { id: 2, src: '/images/gallery/2.jpg', alt: 'Vacaciones en la playa', height: 'short' },
      { id: 3, src: '/images/gallery/3.jpg', alt: 'Navidad en familia', height: 'short' },
      { id: 4, src: '/images/gallery/4.jpg', alt: 'Aniversario', height: 'tall' },
      { id: 5, src: '/images/gallery/5.jpg', alt: 'Propuesta de matrimonio', height: 'short' },
      { id: 6, src: '/images/gallery/6.jpg', alt: 'Con nuestras mascotas', height: 'tall' },
    ],
  },
  dressCode: {
    title: 'Código de Vestimenta',
    subtitle: 'Etiqueta Formal',
    description: 'Les pedimos que nos acompañen vestidos de gala. Para los caballeros, traje oscuro o smoking. Para las damas, vestido largo o cocktail elegante.',
    note: 'Por favor, evitar el uso de color blanco, que está reservado para la novia.',
  },
  accommodation: {
    title: 'Alojamiento',
    description: 'Hemos reservado cuartos preferenciales en estos hoteles para nuestros invitados de fuera:',
    hotels: [
      {
        name: 'Hotel Real del Bosque',
        code: 'BODA2026',
        address: 'Av. Principal 123, Centro Histórico',
        phone: '+52 (55) 1234-5678',
        url: 'https://hotelrealdelbosque.com',
      },
      {
        name: 'Grand Hotel Paraíso',
        code: 'WEDDING26',
        address: 'Boulevard de los Sueños 456, Zona Rosa',
        phone: '+52 (55) 8765-4321',
        url: 'https://grandhotelparaiso.com',
      },
    ],
  },
  giftRegistry: {
    title: 'Mesa de Regalos',
    description: 'Su presencia es nuestro mejor regalo, pero si desean obsequiarnos algo, tenemos las siguientes opciones:',
    registries: [
      {
        name: 'Liverpool',
        description: 'Mesa de regalos tradicional con artículos para el hogar',
        link: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51234567',
        eventNumber: '51234567',
      },
      {
        name: 'Amazon',
        description: 'Nuestra lista de deseos en Amazon',
        link: 'https://www.amazon.com.mx/wedding/share/novios-2026',
        eventNumber: '',
      },
      {
        name: 'Sobre de Efectivo',
        description: 'Si prefieres hacer un regalo monetario, habrá un buzón en la recepción',
        link: '',
        eventNumber: '',
      },
    ],
  },
  footer: {
    text: 'Con amor, María & Juan - 20 de Junio, 2026',
  },
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { section } = body

    if (!section || !defaultSettings[section]) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }

    // Create or update the settings with default values
    const settings = await prisma.siteSettings.upsert({
      where: { section },
      update: { content: defaultSettings[section] },
      create: { 
        section, 
        content: defaultSettings[section]
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error loading defaults:', error)
    return NextResponse.json(
      { error: 'Failed to load default settings' },
      { status: 500 }
    )
  }
}
