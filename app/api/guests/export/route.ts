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
      nombre: guest.firstName,
      apellido: guest.lastName,
      email: guest.email || '',
      teléfono: guest.phone || '',
      maxAcompañantes: guest.maxCompanions,
      estado: guest.rsvp?.status || 'PENDING',
      numAcompañantes: guest.rsvp?.numberOfCompanions || 0,
      mensaje: guest.rsvp?.message || '',
      confirmadoEn: guest.rsvp?.confirmedAt?.toISOString() || '',
    }))

    const csv = Papa.unparse(csvData)
    
    // Agregar BOM UTF-8 para que Excel reconozca correctamente los caracteres especiales
    const csvWithBOM = '\uFEFF' + csv

    return new NextResponse(csvWithBOM, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
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
