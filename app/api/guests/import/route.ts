import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

// POST - Importar invitados desde CSV
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    const text = await file.text()
    
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    const guestsData = result.data as Array<{
      firstName: string
      lastName: string
      email?: string
      phone?: string
      maxCompanions?: string
    }>

    let created = 0
    let errors = 0

    for (const row of guestsData) {
      try {
        if (!row.firstName || !row.lastName) {
          errors++
          continue
        }

        await prisma.guest.create({
          data: {
            firstName: row.firstName.trim(),
            lastName: row.lastName.trim(),
            email: row.email?.trim() || null,
            phone: row.phone?.trim() || null,
            maxCompanions: row.maxCompanions ? parseInt(row.maxCompanions) : 0,
          },
        })
        created++
      } catch (error) {
        console.error('Error creating guest from CSV:', error)
        errors++
      }
    }

    return NextResponse.json({
      success: true,
      created,
      errors,
      total: guestsData.length,
    })
  } catch (error) {
    console.error('Error importing CSV:', error)
    return NextResponse.json(
      { error: 'Error al importar CSV' },
      { status: 500 }
    )
  }
}
