import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Crear admin por defecto
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@wedding.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@wedding.com',
      password: hashedPassword,
      name: 'Administrador',
    },
  })

  console.log('✅ Admin created:', admin.email)

  // Crear algunos invitados de ejemplo
  const guests = await Promise.all([
    prisma.guest.upsert({
      where: { id: 'example-1' },
      update: {},
      create: {
        id: 'example-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        maxCompanions: 2,
      },
    }),
    prisma.guest.upsert({
      where: { id: 'example-2' },
      update: {},
      create: {
        id: 'example-2',
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com',
        maxCompanions: 1,
      },
    }),
    prisma.guest.upsert({
      where: { id: 'example-3' },
      update: {},
      create: {
        id: 'example-3',
        firstName: 'Carlos',
        lastName: 'López',
        maxCompanions: 3,
      },
    }),
  ])

  console.log(`✅ Created ${guests.length} example guests`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
