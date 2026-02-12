import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Crear o actualizar RSVP
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { guestId, status, numberOfCompanions, message } = body

    if (!guestId || !status) {
      return NextResponse.json(
        { error: 'ID de invitado y estado son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el invitado existe
    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Invitado no encontrado' },
        { status: 404 }
      )
    }

    // Validar que el número de acompañantes no exceda el límite
    if (numberOfCompanions > guest.maxCompanions) {
      return NextResponse.json(
        { error: `El número máximo de acompañantes es ${guest.maxCompanions}` },
        { status: 400 }
      )
    }

    // Crear o actualizar RSVP
    const rsvp = await prisma.rSVP.upsert({
      where: { guestId },
      update: {
        status,
        numberOfCompanions: numberOfCompanions || 0,
        message: message || null,
        confirmedAt: status === 'CONFIRMED' ? new Date() : null,
      },
      create: {
        guestId,
        status,
        numberOfCompanions: numberOfCompanions || 0,
        message: message || null,
        confirmedAt: status === 'CONFIRMED' ? new Date() : null,
      },
      include: {
        guest: true,
      },
    })

    return NextResponse.json(rsvp)
  } catch (error) {
    console.error('Error creating/updating RSVP:', error)
    return NextResponse.json(
      { error: 'Error al procesar la confirmación' },
      { status: 500 }
    )
  }
}

// GET - Obtener todas las confirmaciones (requiere autenticación)
export async function GET() {
  try {
    const rsvps = await prisma.rSVP.findMany({
      include: {
        guest: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(rsvps)
  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json(
      { error: 'Error al obtener confirmaciones' },
      { status: 500 }
    )
  }
}
