const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Actualizando información de regalos...')

  await prisma.siteSettings.upsert({
    where: { section: 'giftRegistry' },
    update: {
      content: {
        title: 'Regalos',
        description: 'Su presencia es el mayor regalo que podemos recibir en este día tan especial. Si desean tener un detalle con nosotras les agradeceremos que lo hagan a través de nuestras cuentas bancarias:',
        accounts: [
          {
            bank: 'BBVA',
            accountNumber: '012180 015155817407',
            accountHolder: 'María Fernanda Jiménez Guadarrama',
          },
          {
            bank: 'BBVA',
            accountNumber: '012180 015011248204',
            accountHolder: 'Fernanda Ávalos Pérez',
          },
        ],
      },
    },
    create: {
      section: 'giftRegistry',
      content: {
        title: 'Regalos',
        description: 'Su presencia es el mayor regalo que podemos recibir en este día tan especial. Si desean tener un detalle con nosotras les agradeceremos que lo hagan a través de nuestras cuentas bancarias:',
        accounts: [
          {
            bank: 'BBVA',
            accountNumber: '012180 015155817407',
            accountHolder: 'María Fernanda Jiménez Guadarrama',
          },
          {
            bank: 'BBVA',
            accountNumber: '012180 015011248204',
            accountHolder: 'Fernanda Ávalos Pérez',
          },
        ],
      },
    },
  })

  console.log('✅ Información de regalos actualizada')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
