import { Role } from "@/libs/auth/authorization/role";
import { Post, PrismaClient, Worker } from "./generated/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { TransactionClient } from "./generated/internal/prismaNamespace";
import { isNil } from "lodash";

const teamName = 'Worship Team';

const postNames = [
  'Host',
  'Worship Leader',
  'Keyboard',
  'Guitar',
  'Drum',
  'Bass',
  'Vocal Female',
  'Vocal Male',
  'Audio',
  'Powerpoint',
]

const workerNames = [
  'Jane',
  'Alan',
  'QQ',
  'Gogo',
  'Jeffery',
  'Shu Yan',
  'Vincent',
  'Marco',
  'YL',
  'Foon',
  'Chow Sir',
  'Sunny',
  'Pakho',
  'Andrea',
  'Jason',
  'Kathryn',
  'Simmon',
  'Florence',
  'Amy',
  'Kwok Fai',
  'Betty',
  'Picnic',
  'Ka yan',
  'Louis',
]

const postWorkers = [
  { postName: 'Audio', workerName: 'Chow Sir' },
  { postName: 'Audio', workerName: 'Louis' },
  { postName: 'Audio', workerName: 'Marco' },
  { postName: 'Audio', workerName: 'Picnic' },
  { postName: 'Drum', workerName: 'Jeffery' },
  { postName: 'Drum', workerName: 'Sunny' },
  { postName: 'Guitar', workerName: 'Gogo' },
  { postName: 'Host', workerName: 'Chow Sir' },
  { postName: 'Host', workerName: 'Foon' },
  { postName: 'Host', workerName: 'Jane' },
  { postName: 'Host', workerName: 'Kwok Fai' },
  { postName: 'Host', workerName: 'Simmon' },
  { postName: 'Keyboard', workerName: 'QQ' },
  { postName: 'Powerpoint', workerName: 'Andrea' },
  { postName: 'Powerpoint', workerName: 'Ka yan' },
  { postName: 'Powerpoint', workerName: 'YL' },
  { postName: 'Vocal Male', workerName: 'Jason' },
  { postName: 'Vocal Male', workerName: 'Pakho' },
  { postName: 'Vocal Male', workerName: 'Vincent' },
  { postName: 'Vocal Female', workerName: 'Amy' },
  { postName: 'Vocal Female', workerName: 'Kathryn' },
  { postName: 'Vocal Female', workerName: 'Shu Yan' },
  { postName: 'Worship Leader', workerName: 'Alan' },
  { postName: 'Worship Leader', workerName: 'Betty' },
  { postName: 'Worship Leader', workerName: 'Chow Sir' },
  { postName: 'Worship Leader', workerName: 'Florence' },
  { postName: 'Worship Leader', workerName: 'Jason' },
]

const postAffinities = [
  ['Keyboard', 'Guitar'],
]

const workerAffinities = [
  ['Jason', 'Kathryn'],
  ['Ka yan', 'Louis'],
]

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

const findSystemAdmin = async (tx: TransactionClient) => {
  return await tx.user.findFirst({
    where: {
      roleId: Role.SYSTEM_ADMIN,
    },
  })
}

const insertTeam = async (tx: TransactionClient, ownerId: number) => {
  return await tx.team.create({
    data: {
      ownerId,
      name: teamName,
      maxWorkerAssignPerRoster: 2,
    },
  })
}

const insertPost = async (tx: TransactionClient, teamId: number) => {
  return await tx.post.createManyAndReturn({
    data: postNames.map(name => ({ teamId, name })),
  })
}

const insertWorker = async (tx: TransactionClient, teamId: number) => {
  return await tx.worker.createManyAndReturn({
    data: workerNames.map(name => ({ teamId, name })),
  })
}

const insertPostWorker = async (tx: TransactionClient, posts: Post[], workers: Worker[]) => {
  const insertData: { postId: number, workerId: number }[] = [];
  for (const postWorker of postWorkers) {
    const postId = posts.find(post => post.name === postWorker.postName)?.id;
    const workerId = workers.find(worker => worker.name === postWorker.workerName)?.id;
    if (!isNil(postId) && !isNil(workerId)) {
      insertData.push({ postId, workerId });
    }
  }

  return await tx.postWorker.createMany({
    data: insertData,
  })
}

const insertPostAffinity = async (tx: TransactionClient, teamId: number, posts: Post[]) => {
  for (const affinity of postAffinities) {
    const postIds: number[] = [];
    for (const name of affinity) {
      const postId = posts.find(post => post.name === name)?.id;
      if (!isNil(postId)) {
        postIds.push(postId);
      }
    }

    if (!postIds.length) continue;

    await tx.postAffinity.create({
      data: {
        teamId,
        members: {
          create: postIds.map(postId => ({ postId })),
        },
      }
    })
  }
}

const insertWorkerAffinity = async (tx: TransactionClient, teamId: number, workers: Worker[]) => {
  for (const affinity of workerAffinities) {
    const workerIds: number[] = [];
    for (const name of affinity) {
      const workerId = workers.find(worker => worker.name === name)?.id;
      if (!isNil(workerId)) {
        workerIds.push(workerId);
      }
    }

    if (!workerIds.length) continue;

    await tx.workerAffinity.create({
      data: {
        teamId,
        members: {
          create: workerIds.map(workerId => ({ workerId })),
        },
      }
    })
  }
}

export async function main() {
  console.log('Start seeding team...');

  await prisma.$transaction(async (tx) => {
    const systemAdmin = await findSystemAdmin(tx);
    if (!systemAdmin) {
      console.warn('System admin not found')
      return
    }

    const team = await insertTeam(tx, systemAdmin.id);
    console.log('Team inserted');
    const posts = await insertPost(tx, team.id);
    console.log('Posts inserted');
    const workers = await insertWorker(tx, team.id);
    console.log('Workers inserted');
    await insertPostWorker(tx, posts, workers);
    console.log('Post workers inserted');
    await insertPostAffinity(tx, team.id, posts);
    console.log('Post affinities inserted');
    await insertWorkerAffinity(tx, team.id, workers);
    console.log('Worker affinities inserted');
  })

  console.log('Seeding team completed.');
}

main();