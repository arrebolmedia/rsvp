import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener un invitado específico
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    const guest = await prisma.guest.findUnique({
      where: { id },
      include: { rsvp: true },
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Invitado no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(guest)
  } catch (error) {
    console.error('Error fetching guest:', error)
    return NextResponse.json(
      { error: 'Error al obtener invitado' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar invitado
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { firstName, lastName, email, phone, maxCompanions, tableNumber } = body

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Nombre y apellido son requeridos' },
        { status: 400 }
      )
    }

    const guest = await prisma.guest.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        maxCompanions: parseInt(maxCompanions) || 0,
        tableNumber: tableNumber ? parseInt(tableNumber) : null,
      },
      include: { rsvp: true },
    })

    return NextResponse.json(guest)
  } catch (error) {
    console.error('Error updating guest:', error)
    return NextResponse.json(
      { error: 'Error al actualizar invitado', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar invitado
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.guest.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting guest:', error)
    return NextResponse.json(
      { error: 'Error al eliminar invitado' },
      { status: 500 }
    )
  }
}
