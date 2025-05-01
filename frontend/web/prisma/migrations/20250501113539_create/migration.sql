/*
  Warnings:

  - You are about to drop the column `tenant` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `tenant` on the `post_worker` table. All the data in the column will be lost.
  - You are about to drop the column `tenant` on the `worker` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenant_id,post_id,worker_id]` on the table `post_worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenant_id` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `post_worker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `worker` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "post_worker_tenant_post_id_worker_id_key";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "tenant",
ADD COLUMN     "tenant_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "post_worker" DROP COLUMN "tenant",
ADD COLUMN     "tenant_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "worker" DROP COLUMN "tenant",
ADD COLUMN     "tenant_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "tenant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_name_key" ON "tenant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "post_worker_tenant_id_post_id_worker_id_key" ON "post_worker"("tenant_id", "post_id", "worker_id");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
