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

    const conditions: string[] = []
    const values: string[] = []
    let idx = 1

    if (firstName) {
      conditions.push(`unaccent(lower(g."firstName")) LIKE unaccent(lower($${idx}))`)
      values.push(`%${firstName}%`)
      idx++
    }
    if (lastName) {
      conditions.push(`unaccent(lower(g."lastName")) LIKE unaccent(lower($${idx}))`)
      values.push(`%${lastName}%`)
      idx++
    }

    const where = conditions.join(' AND ')
    const guests = await prisma.$queryRawUnsafe<any[]>(
      `SELECT g.*, row_to_json(r.*) as rsvp
       FROM "Guest" g
       LEFT JOIN "RSVP" r ON r."guestId" = g.id
       WHERE ${where}
       ORDER BY g."firstName", g."lastName"`,
      ...values
    )

    return NextResponse.json(guests)
  } catch (error) {
    console.error('Error searching guests:', error)
    return NextResponse.json(
      { error: 'Error al buscar invitados' },
      { status: 500 }
    )
  }
}
