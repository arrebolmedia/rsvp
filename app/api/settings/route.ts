import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')

  if (section) {
    const settings = await prisma.siteSettings.findUnique({
      where: { section },
    })
    return NextResponse.json(settings?.content || {})
  }

  const allSettings = await prisma.siteSettings.findMany()
  const settingsMap = allSettings.reduce((acc, curr) => {
    acc[curr.section] = curr.content
    return acc
  }, {} as Record<string, any>)

  return NextResponse.json(settingsMap)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { section, content } = body

  if (!section || !content) {
    return NextResponse.json({ error: 'Missing section or content' }, { status: 400 })
  }

  const settings = await prisma.siteSettings.upsert({
    where: { section },
    update: { content },
    create: { section, content },
  })

  return NextResponse.json(settings)
}
