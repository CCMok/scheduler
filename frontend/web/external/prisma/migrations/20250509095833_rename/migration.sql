/*
  Warnings:

  - You are about to drop the `constraint_setting_post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `constraint_setting_worker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "constraint_setting_post" DROP CONSTRAINT "constraint_setting_post_constraint_setting_id_fkey";

-- DropForeignKey
ALTER TABLE "constraint_setting_post" DROP CONSTRAINT "constraint_setting_post_post_id_fkey";

-- DropForeignKey
ALTER TABLE "constraint_setting_worker" DROP CONSTRAINT "constraint_setting_worker_constraint_setting_id_fkey";

-- DropForeignKey
ALTER TABLE "constraint_setting_worker" DROP CONSTRAINT "constraint_setting_worker_worker_id_fkey";

-- DropTable
DROP TABLE "constraint_setting_post";

-- DropTable
DROP TABLE "constraint_setting_worker";

-- CreateTable
CREATE TABLE "post_constraint_setting_post" (
    "id" SERIAL NOT NULL,
    "constraint_setting_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "post_constraint_setting_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_constraint_setting_worker" (
    "id" SERIAL NOT NULL,
    "constraint_setting_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "worker_constraint_setting_worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_constraint_setting_post_constraint_setting_id_idx" ON "post_constraint_setting_post"("constraint_setting_id");

-- CreateIndex
CREATE INDEX "post_constraint_setting_post_post_id_idx" ON "post_constraint_setting_post"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_constraint_setting_post_constraint_setting_id_post_id_key" ON "post_constraint_setting_post"("constraint_setting_id", "post_id");

-- CreateIndex
CREATE INDEX "worker_constraint_setting_worker_constraint_setting_id_idx" ON "worker_constraint_setting_worker"("constraint_setting_id");

-- CreateIndex
CREATE INDEX "worker_constraint_setting_worker_worker_id_idx" ON "worker_constraint_setting_worker"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_constraint_setting_worker_constraint_setting_id_work_key" ON "worker_constraint_setting_worker"("constraint_setting_id", "worker_id");

-- AddForeignKey
ALTER TABLE "post_constraint_setting_post" ADD CONSTRAINT "post_constraint_setting_post_constraint_setting_id_fkey" FOREIGN KEY ("constraint_setting_id") REFERENCES "post_constraint_setting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint_setting_post" ADD CONSTRAINT "post_constraint_setting_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint_setting_worker" ADD CONSTRAINT "worker_constraint_setting_worker_constraint_setting_id_fkey" FOREIGN KEY ("constraint_setting_id") REFERENCES "worker_constraint_setting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint_setting_worker" ADD CONSTRAINT "worker_constraint_setting_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
