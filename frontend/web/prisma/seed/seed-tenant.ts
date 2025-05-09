import { DefaultArgs } from "../../prisma-generated/runtime/library"
import { Post, PostConstraintType, Prisma, PrismaClient, Worker, WorkerConstraintType } from "../../prisma-generated"
import { postConstraintSettings, postNames, postWorkers, tenantName, workerConstraintSettings, workerNames } from "./data/seed-data-demo"
import { PostConstraintType as EPostConstraintType, WorkerConstraintType as EWorkerConstraintType } from "../../libs/share/enums/constraint-type";

const prisma = new PrismaClient()

type Transaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

async function main() {
  await prisma.$transaction(async tx => {
    console.log(`Start seed tenant data : ${tenantName} ...`)

    const tenantId = await seedTenant(tx)
    console.log('Tenant OK')

    const postMap = await seedPost(tx, tenantId)
    console.log('Post OK');

    const workerMap = await seedWorker(tx, tenantId)
    console.log('Worker OK')

    await seedPostWorker(tx, postMap, workerMap)
    console.log('Post worker OK')

    await seedPostConstraintSetting(tx, tenantId, postMap)
    console.log('Post constraint setting OK')

    await seedWorkerConstraintSetting(tx, tenantId, workerMap)
    console.log('Worker constraint setting OK')

    console.log('Finish!')
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

const seedPost = async (tx: Transaction, tenantId: number): Promise<Map<string, Post>> => {
  const posts: Post[] = [];
  for (const postName of postNames) {
    const post = await tx.post.upsert({
      where: { tenantId_name: { tenantId, name: postName } },
      update: {},
      create: { tenantId, name: postName },
    })

    posts.push(post)
  }

  return posts.reduce((map, post) => {
    map.set(post.name, post)
    return map
  }, new Map<string, Post>())
}

const seedWorker = async (tx: Transaction, tenantId: number): Promise<Map<string, Worker>> => {
  const workers: Worker[] = [];
  for (const workerName of workerNames) {
    const worker = await tx.worker.upsert({
      where: { tenantId_name: { tenantId, name: workerName } },
      update: {},
      create: { tenantId, name: workerName },
    })

    workers.push(worker)
  }

  return workers.reduce((map, worker) => {
    map.set(worker.name, worker)
    return map
  }, new Map<string, Worker>())
}

const seedPostWorker = async (tx: Transaction, postMap: Map<string, Post>, workers: Map<string, Worker>): Promise<void> => {
  for (const postWorker of postWorkers) {
    const post = postMap.get(postWorker.postName)
    if (!post) {
      throw new Error(`Post not found: ${postWorker.postName}`)
    }

    const worker = workers.get(postWorker.workerName)
    if (!worker) {
      throw new Error(`Worker not found: ${postWorker.workerName}`)
    }

    await tx.postWorker.upsert({
      where: { postId_workerId: { postId: post.id, workerId: worker.id } },
      update: {},
      create: { postId: post.id, workerId: worker.id },
    })
  }
}

const seedPostConstraintSetting = async (tx: Transaction, tenantId: number, postMap: Map<string, Post>): Promise<void> => {
  await tx.postConstraintSetting.deleteMany({
    where: { tenantId },
  })

  const postConstraintTypeMap = await getPostConstraintTypeMap(tx);

  for (const constraintSetting of postConstraintSettings) {
    const constraintSettingPosts: { postId: number }[] = [];

    for (const postName of constraintSetting.postNames) {
      const post = postMap.get(postName)
      if (!post) {
        throw new Error(`Post not found: ${postName}`)
      }
      constraintSettingPosts.push({ postId: post.id })
    }

    let postConstraintType = postConstraintTypeMap.get(constraintSetting.constraintTypeEnum);
    if (!postConstraintType) {
      throw new Error(`Post constraint type not found. enum: ${constraintSetting.constraintTypeEnum}`)
    }

    await tx.postConstraintSetting.create({
      data: {
        tenantId,
        constraintTypeId: postConstraintType.id,
        weighting: constraintSetting.weighting,
        posts: {
          create: constraintSettingPosts,
        },
      }
    })
  }
}

const getPostConstraintTypeMap = async (tx: Transaction): Promise<Map<EPostConstraintType, PostConstraintType>> => {
  const postConstraintType = await tx.postConstraintType.findMany()

  return postConstraintType.reduce((map, constraintType) => {
    map.set(constraintType.enum, constraintType)
    return map
  }, new Map<EPostConstraintType, PostConstraintType>())
}

const seedWorkerConstraintSetting = async (tx: Transaction, tenantId: number, workerMap: Map<string, Worker>): Promise<void> => {
  await tx.workerConstraintSetting.deleteMany({
    where: { tenantId },
  })

  const workerConstraintTypeMap = await getWorkerConstraintTypeMap(tx);

  for (const constraintSetting of workerConstraintSettings) {
    const constraintSettingWorkers: { workerId: number }[] = [];

    for (const workerName of constraintSetting.workerNames) {
      const worker = workerMap.get(workerName)
      if (!worker) {
        throw new Error(`Worker not found: ${workerName}`)
      }
      constraintSettingWorkers.push({ workerId: worker.id })
    }

    let workerConstraintType = workerConstraintTypeMap.get(constraintSetting.constraintTypeEnum);
    if (!workerConstraintType) {
      throw new Error(`Worker constraint type not found. enum: ${constraintSetting.constraintTypeEnum}`)
    }

    await tx.workerConstraintSetting.create({
      data: {
        tenantId,
        constraintTypeId: workerConstraintType.id,
        weighting: constraintSetting.weighting,
        workers: {
          create: constraintSettingWorkers,
        },
      }
    })
  }
}

const getWorkerConstraintTypeMap = async (tx: Transaction): Promise<Map<EWorkerConstraintType, WorkerConstraintType>> => {
  const workerConstraintType = await tx.workerConstraintType.findMany()

  return workerConstraintType.reduce((map, constraintType) => {
    map.set(constraintType.enum, constraintType)
    return map
  }, new Map<EWorkerConstraintType, WorkerConstraintType>())
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