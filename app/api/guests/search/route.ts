import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar invitados por nombre
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const firstName = searchParams.get('firstName')
    const lastName = searchParams.get('lastName')

    if (!firstName && !lastName) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un nombre o apellido' },
        { status: 400 }
      )
    }

    const guests = await prisma.guest.findMany({
      where: {
        AND: [
          firstName ? {
            firstName: {
              contains: firstName,
              mode: 'insensitive',
            },
          } : {},
          lastName ? {
            lastName: {
              contains: lastName,
              mode: 'insensitive',
            },
          } : {},
        ],
      },
      include: {
        rsvp: true,
      },
    })

    return NextResponse.json(guests)
  } catch (error) {
    console.error('Error searching guests:', error)
    return NextResponse.json(
      { error: 'Error al buscar invitados' },
      { status: 500 }
    )
  }
}
