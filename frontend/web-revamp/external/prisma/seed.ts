import { Role } from "@/libs/auth/role/role";
import { PrismaClient, Prisma } from "./generated/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

const insertRole = async () => {
  await prisma.role.createMany({
    data: [
      { id: Role.SYSTEM_ADMIN , name: 'System Admin' },
      { id: Role.BASIC_USER , name: 'Basic User' },
    ],
  })
}

export async function main() {
  console.log('Start seeding...');
  await insertRole();
  console.log('Roles seeded successfully.');
  console.log('Seeding completed.');
}

main();