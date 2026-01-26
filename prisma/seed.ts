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

  // Crear 20 invitados de ejemplo con estados variados
  const guestsData = [
    { id: 'g1', firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com', phone: '5551234567', maxCompanions: 2, hasRsvp: true, status: 'CONFIRMED', companions: 2, message: '¡Ahí estaremos!' },
    { id: 'g2', firstName: 'María', lastName: 'García', email: 'maria@example.com', phone: '5557654321', maxCompanions: 1, hasRsvp: true, status: 'CONFIRMED', companions: 1, message: 'No puedo esperar' },
    { id: 'g3', firstName: 'Carlos', lastName: 'López', email: 'carlos@example.com', maxCompanions: 3, hasRsvp: true, status: 'DECLINED', companions: 0, message: 'Lamentablemente no podré asistir' },
    { id: 'g4', firstName: 'Ana', lastName: 'Martínez', email: 'ana@example.com', phone: '5559876543', maxCompanions: 0, hasRsvp: true, status: 'CONFIRMED', companions: 0, message: 'Allí estaré' },
    { id: 'g5', firstName: 'Luis', lastName: 'Rodríguez', email: 'luis@example.com', maxCompanions: 2, hasRsvp: false, status: 'PENDING', companions: 0 },
    { id: 'g6', firstName: 'Carmen', lastName: 'Hernández', email: 'carmen@example.com', phone: '5552468135', maxCompanions: 1, hasRsvp: true, status: 'CONFIRMED', companions: 0, message: 'Confirmo mi asistencia' },
    { id: 'g7', firstName: 'Roberto', lastName: 'González', maxCompanions: 3, hasRsvp: false, status: 'PENDING', companions: 0 },
    { id: 'g8', firstName: 'Patricia', lastName: 'Sánchez', email: 'patricia@example.com', maxCompanions: 1, hasRsvp: true, status: 'DECLINED', companions: 0, message: 'Muchas gracias por la invitación pero no podré ir' },
    { id: 'g9', firstName: 'Fernando', lastName: 'Ramírez', email: 'fernando@example.com', phone: '5553698741', maxCompanions: 2, hasRsvp: true, status: 'CONFIRMED', companions: 2, message: 'Confirmados los 3' },
    { id: 'g10', firstName: 'Laura', lastName: 'Torres', email: 'laura@example.com', maxCompanions: 0, hasRsvp: false, status: 'PENDING', companions: 0 },
    { id: 'g11', firstName: 'Miguel', lastName: 'Flores', email: 'miguel@example.com', phone: '5558529631', maxCompanians: 2, hasRsvp: true, status: 'CONFIRMED', companions: 1, message: 'Voy con mi esposa' },
    { id: 'g12', firstName: 'Isabel', lastName: 'Muñoz', maxCompanions: 1, hasRsvp: false, status: 'PENDING', companions: 0 },
    { id: 'g13', firstName: 'Diego', lastName: 'Jiménez', email: 'diego@example.com', phone: '5557418529', maxCompanions: 3, hasRsvp: true, status: 'DECLINED', companions: 0 },
    { id: 'g14', firstName: 'Sofía', lastName: 'Ruiz', email: 'sofia@example.com', maxCompanions: 0, hasRsvp: true, status: 'CONFIRMED', companions: 0, message: '¡Qué emoción!' },
    { id: 'g15', firstName: 'Javier', lastName: 'Moreno', email: 'javier@example.com', phone: '5556321478', maxCompanions: 2, hasRsvp: true, status: 'CONFIRMED', companions: 2, message: 'Iremos toda la familia' },
    { id: 'g16', firstName: 'Daniela', lastName: 'Álvarez', email: 'daniela@example.com', maxCompanions: 1, hasRsvp: false, status: 'PENDING', companions: 0 },
    { id: 'g17', firstName: 'Ricardo', lastName: 'Romero', phone: '5559517532', maxCompanions: 2, hasRsvp: true, status: 'CONFIRMED', companions: 0, message: 'Voy solo' },
    { id: 'g18', firstName: 'Gabriela', lastName: 'Núñez', email: 'gabriela@example.com', maxCompanions: 0, hasRsvp: true, status: 'DECLINED', companions: 0, message: 'Gracias pero no asistiré' },
    { id: 'g19', firstName: 'Andrés', lastName: 'Peña', email: 'andres@example.com', phone: '5558642973', maxCompanions: 3, hasRsvp: false, status: 'PENDING', companions: 0 },
    { id: 'g20', firstName: 'Valeria', lastName: 'Castro', email: 'valeria@example.com', maxCompanions: 1, hasRsvp: true, status: 'CONFIRMED', companions: 1, message: 'Nos vemos allá' },
  ]

  for (const guestData of guestsData) {
    const guest = await prisma.guest.upsert({
      where: { id: guestData.id },
      update: {},
      create: {
        id: guestData.id,
        firstName: guestData.firstName,
        lastName: guestData.lastName,
        email: guestData.email,
        phone: guestData.phone,
        maxCompanions: guestData.maxCompanions,
      },
    })

    if (guestData.hasRsvp) {
      await prisma.rSVP.upsert({
        where: { guestId: guest.id },
        update: {},
        create: {
          guestId: guest.id,
          status: guestData.status as 'CONFIRMED' | 'DECLINED' | 'PENDING',
          numberOfCompanions: guestData.companions,
          message: guestData.message,
        },
      })
    }
  }

  console.log(`✅ Created ${guestsData.length} example guests`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
