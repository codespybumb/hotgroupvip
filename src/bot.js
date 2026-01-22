import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

await prisma.$connect()
console.log('✅ Banco conectado com sucesso')
