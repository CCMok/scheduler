import { DefaultArgs } from "../../prisma-generated/runtime/library"
import { Prisma, PrismaClient } from "../../prisma-generated"
import { postConstraintTypes, workerConstraintTypes } from "./data/seed-data-system"

const prisma = new PrismaClient()

type Transaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

async function main() {
  await prisma.$transaction(async tx => {
    console.log('Start seed system data...')

    await seedPostConstraintType(tx);
    console.log('Post constraint type OK')

    await seedWorkerConstraintType(tx);
    console.log('Worker constraint type OK')

    console.log('Finish!')
  })
}

const seedPostConstraintType = async (tx: Transaction): Promise<void> => {
  for (const postConstraintType of postConstraintTypes) {
    await tx.postConstraintType.upsert({
      where: { name: postConstraintType.name },
      update: { enum: postConstraintType.enum },
      create: postConstraintType,
    })
  }
}

const seedWorkerConstraintType = async (tx: Transaction): Promise<void> => {
  for (const workerConstraintType of workerConstraintTypes) {
    await tx.workerConstraintType.upsert({
      where: { name: workerConstraintType.name },
      update: { enum: workerConstraintType.enum },
      create: workerConstraintType,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })