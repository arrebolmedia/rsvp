import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Obtener estadísticas (requiere autenticación)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const totalGuests = await prisma.guest.count()
    
    const confirmed = await prisma.rSVP.count({
      where: { status: 'CONFIRMED' },
    })
    
    const declined = await prisma.rSVP.count({
      where: { status: 'DECLINED' },
    })

    // Pendientes = todos los que no han confirmado ni declinado (incluye sin RSVP)
    const pending = totalGuests - confirmed - declined

    const totalConfirmedPeople = await prisma.rSVP.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: {
        numberOfCompanions: true,
      },
    })

    const confirmedWithGuests = confirmed + (totalConfirmedPeople._sum.numberOfCompanions || 0)

    return NextResponse.json({
      totalGuests,
      confirmed,
      pending,
      declined,
      confirmedWithGuests,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
