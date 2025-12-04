import { prisma } from '@/lib/prisma'
import HomePage from '@/components/HomePage'

export const dynamic = 'force-dynamic'

async function getSettings() {
  const allSettings = await prisma.siteSettings.findMany()
  return allSettings.reduce((acc, curr) => {
    acc[curr.section] = curr.content
    return acc
  }, {} as Record<string, any>)
}

export default async function Page() {
  const settings = await getSettings()
  return <HomePage settings={settings} />
}
