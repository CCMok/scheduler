import { DefaultArgs } from "../../prisma-generated/runtime/library"
import { Post, PostConstraintType, Prisma, PrismaClient, Worker, WorkerConstraintType } from "../../prisma-generated"
import { postConstraints, postNames, postWorkers, organizationName, workerConstraints, workerNames, departmentName, organizationMaxHistoryCount } from "./data/seed-data-demo"
import { PostConstraintType as EPostConstraintType, WorkerConstraintType as EWorkerConstraintType } from "../../../libs/share/_general/enums/constraint-type";

const prisma = new PrismaClient()

type Transaction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

async function main() {
  await prisma.$transaction(async tx => {
    console.log(`Start seed organization data : ${organizationName} ...`)

    const organizationId = await seedOrganization(tx)
    console.log('Organization OK')

    const departmentId = await seedDepartment(tx, organizationId)
    console.log('Department OK')

    const postMap = await seedPost(tx, departmentId)
    console.log('Post OK');

    const workerMap = await seedWorker(tx, departmentId)
    console.log('Worker OK')

    await seedPostWorker(tx, postMap, workerMap)
    console.log('Post worker OK')

    await seedPostConstraintSetting(tx, departmentId, postMap)
    console.log('Post constraint setting OK')

    await seedWorkerConstraintSetting(tx, departmentId, workerMap)
    console.log('Worker constraint setting OK')

    console.log('Finish!')
  })
}

const seedOrganization = async (tx: Transaction): Promise<number> => {
  const organization = await tx.organization.create({
    data: { 
      name: organizationName,
      maxHistoryCount: organizationMaxHistoryCount,
    },
  })

  return organization.id;
}

const seedDepartment = async (tx: Transaction, organizationId: number): Promise<number> => {
  const department = await tx.department.create({
    data: {
      organizationId,
      name: departmentName,
    },
  })

  return department.id;
}

const seedPost = async (tx: Transaction, departmentId: number): Promise<Map<string, Post>> => {
  const posts = await tx.post.createManyAndReturn({
    data: postNames.map((name, index) => ({
      departmentId,
      name,
      displayPosition: index,
    })),
  })

  return posts.reduce((map, post) => {
    map.set(post.name, post)
    return map
  }, new Map<string, Post>())
}

const seedWorker = async (tx: Transaction, departmentId: number): Promise<Map<string, Worker>> => {
  const workers = await tx.worker.createManyAndReturn({
    data: workerNames.map(name => ({
      departmentId,
      name,
    })),
  })

  return workers.reduce((map, worker) => {
    map.set(worker.name, worker)
    return map
  }, new Map<string, Worker>())
}

const seedPostWorker = async (tx: Transaction, postMap: Map<string, Post>, workers: Map<string, Worker>): Promise<void> => {
  const postWorkerIds: { postId: number, workerId: number }[] = [];
  
  for (const postWorker of postWorkers) {
    const post = postMap.get(postWorker.postName)
    if (!post) {
      throw new Error(`Post not found: ${postWorker.postName}`)
    }

    const worker = workers.get(postWorker.workerName)
    if (!worker) {
      throw new Error(`Worker not found: ${postWorker.workerName}`)
    }

    postWorkerIds.push({ postId: post.id, workerId: worker.id })
  }

  await tx.postWorker.createMany({
    data: postWorkerIds,
  })
}

const seedPostConstraintSetting = async (tx: Transaction, departmentId: number, postMap: Map<string, Post>): Promise<void> => {
  const postConstraintTypeMap = await getPostConstraintTypeMap(tx);

  for (const postConstraint of postConstraints) {
    const postConstraintPosts: { postId: number }[] = [];

    for (const postName of postConstraint.postNames) {
      const post = postMap.get(postName)
      if (!post) {
        throw new Error(`Post not found: ${postName}`)
      }
      postConstraintPosts.push({ postId: post.id })
    }

    let postConstraintType = postConstraintTypeMap.get(postConstraint.constraintTypeEnum);
    if (!postConstraintType) {
      throw new Error(`Post constraint type not found. enum: ${postConstraint.constraintTypeEnum}`)
    }

    await tx.postConstraint.create({
      data: {
        departmentId,
        postConstraintTypeId: postConstraintType.id,
        weighting: postConstraint.weighting,
        postConstraintPosts: {
          create: postConstraintPosts,
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

const seedWorkerConstraintSetting = async (tx: Transaction, departmentId: number, workerMap: Map<string, Worker>): Promise<void> => {
  const workerConstraintTypeMap = await getWorkerConstraintTypeMap(tx);

  for (const workerConstraint of workerConstraints) {
    const workerConstraintWorkers: { workerId: number }[] = [];

    for (const workerName of workerConstraint.workerNames) {
      const worker = workerMap.get(workerName)
      if (!worker) {
        throw new Error(`Worker not found: ${workerName}`)
      }
      workerConstraintWorkers.push({ workerId: worker.id })
    }

    let workerConstraintType = workerConstraintTypeMap.get(workerConstraint.constraintTypeEnum);
    if (!workerConstraintType) {
      throw new Error(`Worker constraint type not found. enum: ${workerConstraint.constraintTypeEnum}`)
    }

    await tx.workerConstraint.create({
      data: {
        departmentId,
        workerConstraintTypeId: workerConstraintType.id,
        weighting: workerConstraint.weighting,
        workerConstraintWorkers: {
          create: workerConstraintWorkers,
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