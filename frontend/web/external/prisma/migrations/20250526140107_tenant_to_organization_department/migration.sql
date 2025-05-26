/*
  Warnings:

  - You are about to drop the column `tenant_id` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `post_constraint` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `worker` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `worker_constraint` table. All the data in the column will be lost.
  - You are about to drop the `tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_tenant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[department_id,name]` on the table `post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[department_id,name]` on the table `worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department_id` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `post_constraint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `worker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `worker_constraint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "post_constraint" DROP CONSTRAINT "post_constraint_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tenant" DROP CONSTRAINT "user_tenant_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tenant" DROP CONSTRAINT "user_tenant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "worker" DROP CONSTRAINT "worker_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_constraint" DROP CONSTRAINT "worker_constraint_tenant_id_fkey";

-- DropIndex
DROP INDEX "post_tenant_id_idx";

-- DropIndex
DROP INDEX "post_tenant_id_name_key";

-- DropIndex
DROP INDEX "post_constraint_tenant_id_idx";

-- DropIndex
DROP INDEX "worker_tenant_id_idx";

-- DropIndex
DROP INDEX "worker_tenant_id_name_key";

-- DropIndex
DROP INDEX "worker_constraint_tenant_id_idx";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "tenant_id",
ADD COLUMN     "department_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "post_constraint" DROP COLUMN "tenant_id",
ADD COLUMN     "department_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "worker" DROP COLUMN "tenant_id",
ADD COLUMN     "department_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "worker_constraint" DROP COLUMN "tenant_id",
ADD COLUMN     "department_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "tenant";

-- DropTable
DROP TABLE "user_tenant";

-- CreateTable
CREATE TABLE "organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_organization" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "user_organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_name_key" ON "organization"("name");

-- CreateIndex
CREATE INDEX "user_organization_user_id_idx" ON "user_organization"("user_id");

-- CreateIndex
CREATE INDEX "user_organization_organization_id_idx" ON "user_organization"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_organization_user_id_organization_id_key" ON "user_organization"("user_id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE INDEX "department_organization_id_idx" ON "department"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_organization_id_name_key" ON "department"("organization_id", "name");

-- CreateIndex
CREATE INDEX "post_department_id_idx" ON "post"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_department_id_name_key" ON "post"("department_id", "name");

-- CreateIndex
CREATE INDEX "post_constraint_department_id_idx" ON "post_constraint"("department_id");

-- CreateIndex
CREATE INDEX "worker_department_id_idx" ON "worker"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_department_id_name_key" ON "worker"("department_id", "name");

-- CreateIndex
CREATE INDEX "worker_constraint_department_id_idx" ON "worker_constraint"("department_id");

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint" ADD CONSTRAINT "post_constraint_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint" ADD CONSTRAINT "worker_constraint_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
