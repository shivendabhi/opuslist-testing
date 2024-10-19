import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }
  prisma = global.cachedPrisma
}

prisma.$connect()
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.error('Failed to connect to the database:', error))

export const db = prisma
