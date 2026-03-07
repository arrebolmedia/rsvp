const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  const csvPath = path.join(__dirname, '..', 'Lista Invitados Fer y Fer.csv')
  const text = fs.readFileSync(csvPath, 'utf-8')

  const lines = text.split('\n').filter(l => l.trim())
  // Skip header
  const rows = lines.slice(1)

  let created = 0
  let skipped = 0

  for (const line of rows) {
    // Parse CSV (simple split by comma, last field is number)
    const parts = line.split(',')
    if (parts.length < 3) { skipped++; continue }

    const fullName = parts[0].trim()
    const boletos = parseInt(parts[parts.length - 1].trim())

    if (!fullName || isNaN(boletos)) { skipped++; continue }

    // Split name: first word = firstName, rest = lastName
    const [firstName, ...lastParts] = fullName.split(' ').filter(Boolean)
    const lastName = lastParts.join(' ') || '-'

    // boletos = total (including main guest), so companions = boletos - 1
    const maxCompanions = Math.max(0, boletos - 1)

    try {
      await prisma.guest.create({
        data: {
          firstName,
          lastName,
          maxCompanions,
          email: null,
          phone: null,
        }
      })
      created++
      console.log(`✓ ${firstName} ${lastName} (${maxCompanions} acompañantes)`)
    } catch (e) {
      console.error(`✗ Error con ${fullName}:`, e.message)
      skipped++
    }
  }

  console.log(`\nImportados: ${created} | Omitidos: ${skipped}`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
