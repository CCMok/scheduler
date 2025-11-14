import { PrismaClient } from '@/external/prisma-generated'

const globalForPrisma = global as unknown as {
	prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient({
	transactionOptions: {
		timeout: 30000, // ms
		maxWait: 10000, // max time wait to acquire connection
	},
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma