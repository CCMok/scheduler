/*
  Warnings:

  - A unique constraint covering the columns `[tenant,post_id,worker_id]` on the table `post_worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenant` to the `post_worker` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "post_worker_post_id_worker_id_key";

-- AlterTable
ALTER TABLE "post_worker" ADD COLUMN     "tenant" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "post_worker_tenant_post_id_worker_id_key" ON "post_worker"("tenant", "post_id", "worker_id");
