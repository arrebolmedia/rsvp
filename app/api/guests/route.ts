import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los invitados (requiere autenticación)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const guests = await prisma.guest.findMany({
      include: {
        rsvp: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    })

    return NextResponse.json(guests)
  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json(
      { error: 'Error al obtener invitados' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo invitado (requiere autenticación)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, maxCompanions } = body

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Nombre y apellido son requeridos' },
        { status: 400 }
      )
    }

    const guest = await prisma.guest.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        maxCompanions: maxCompanions || 0,
      },
    })

    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    console.error('Error creating guest:', error)
    return NextResponse.json(
      { error: 'Error al crear invitado' },
      { status: 500 }
    )
  }
}
