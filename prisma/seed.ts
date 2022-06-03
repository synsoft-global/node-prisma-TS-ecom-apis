import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const prefernceData: Prisma.PreferencesCreateInput[] = [
  {
    preference: 'Furniture',
  },
  {
    preference: 'Music',
  },
  {
    preference: 'Clothing',
  },
  {
    preference: 'Hardware',
  },
  {
    preference: 'Jewellery ',
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of prefernceData) {
    const preferences = await prisma.preferences.create({
      data: u,
    })
    console.log(`Created preference with id: ${preferences.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
