/*
  Warnings:

  - You are about to drop the column `tenant_id` on the `post_worker` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[post_id,worker_id]` on the table `post_worker` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "post_worker" DROP CONSTRAINT "post_worker_tenant_id_fkey";

-- DropIndex
DROP INDEX "post_worker_tenant_id_post_id_worker_id_key";

-- AlterTable
ALTER TABLE "post_worker" DROP COLUMN "tenant_id";

-- CreateIndex
CREATE UNIQUE INDEX "post_worker_post_id_worker_id_key" ON "post_worker"("post_id", "worker_id");
