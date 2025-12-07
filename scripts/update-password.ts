import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const newPassword = process.argv[2]
  const email = process.env.ADMIN_EMAIL || 'admin@arrebolweddings.com'

  if (!newPassword) {
    console.error('Please provide a new password')
    process.exit(1)
  }

  console.log(`Updating password for ${email}...`)

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.admin.update({
    where: { email },
    data: { password: hashedPassword },
  })

  console.log('✅ Password updated successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
