import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

// GET - Exportar invitados a CSV
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

    const csvData = guests.map((guest: any) => ({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email || '',
      phone: guest.phone || '',
      maxCompanions: guest.maxCompanions,
      status: guest.rsvp?.status || 'PENDING',
      numberOfCompanions: guest.rsvp?.numberOfCompanions || 0,
      message: guest.rsvp?.message || '',
      confirmedAt: guest.rsvp?.confirmedAt?.toISOString() || '',
    }))

    const csv = Papa.unparse(csvData)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="guests-${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json(
      { error: 'Error al exportar CSV' },
      { status: 500 }
    )
  }
}
