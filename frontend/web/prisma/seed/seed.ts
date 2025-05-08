import { DefaultArgs } from "../../prisma-generated/runtime/library"
import { Post, Prisma, PrismaClient, Worker } from "../../prisma-generated"
import { postNames, tenantName, workerNames } from "./seed-data-demo"

const prisma = new PrismaClient()

type Transaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

async function main() {
  await prisma.$transaction(async tx => {
    console.log('Start seed')

    console.log('Tenant Name:', tenantName)

    const tenantId = await seedTenant(tx)
    console.log('Tenant seeded with ID:', tenantId)

    const posts = await seedPost(tx, tenantId)
    console.log('Posts seeded:', posts.length)

    const workers = await seedWorker(tx, tenantId)
    console.log('Workers seeded:', workers.length)

    console.log('Finish seed')
  })
}

const seedTenant = async (tx: Transaction): Promise<number> => {
  const tenant = await tx.tenant.upsert({
    where: { name: tenantName },
    update: {},
    create: { name: tenantName },
  })

  return tenant.id;
}

const seedPost = async (tx: Transaction, tenantId: number): Promise<Post[]> => {
  const posts: Post[] = [];
  for (const postName of postNames) {
    const post = await tx.post.upsert({
      where: { tenantId_name: { tenantId, name: postName } },
      update: {},
      create: { tenantId, name: postName },
    })

    posts.push(post)
  }

  return posts
}

const seedWorker = async (tx: Transaction, tenantId: number): Promise<Worker[]> => {
  const workers: Worker[] = [];
  for (const workerName of workerNames) {
    const worker = await tx.worker.upsert({
      where: { tenantId_name: { tenantId, name: workerName } },
      update: {},
      create: { tenantId, name: workerName },
    })

    workers.push(worker)
  }

  return workers
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