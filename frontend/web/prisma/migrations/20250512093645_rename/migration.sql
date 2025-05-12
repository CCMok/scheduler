/*
  Warnings:

  - You are about to drop the `post_constraint_setting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_constraint_setting_post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `worker_constraint_setting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `worker_constraint_setting_worker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_constraint_setting" DROP CONSTRAINT "post_constraint_setting_constraint_type_id_fkey";

-- DropForeignKey
ALTER TABLE "post_constraint_setting" DROP CONSTRAINT "post_constraint_setting_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "post_constraint_setting_post" DROP CONSTRAINT "post_constraint_setting_post_constraint_setting_id_fkey";

-- DropForeignKey
ALTER TABLE "post_constraint_setting_post" DROP CONSTRAINT "post_constraint_setting_post_post_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_constraint_setting" DROP CONSTRAINT "worker_constraint_setting_constraint_type_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_constraint_setting" DROP CONSTRAINT "worker_constraint_setting_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_constraint_setting_worker" DROP CONSTRAINT "worker_constraint_setting_worker_constraint_setting_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_constraint_setting_worker" DROP CONSTRAINT "worker_constraint_setting_worker_worker_id_fkey";

-- DropTable
DROP TABLE "post_constraint_setting";

-- DropTable
DROP TABLE "post_constraint_setting_post";

-- DropTable
DROP TABLE "worker_constraint_setting";

-- DropTable
DROP TABLE "worker_constraint_setting_worker";

-- CreateTable
CREATE TABLE "post_constraint" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "post_constraint_type_id" INTEGER NOT NULL,
    "weighting" INTEGER NOT NULL,

    CONSTRAINT "post_constraint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_constraint_post" (
    "id" SERIAL NOT NULL,
    "post_constraint_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "post_constraint_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_constraint" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "worker_constraint_type_id" INTEGER NOT NULL,
    "weighting" INTEGER NOT NULL,

    CONSTRAINT "worker_constraint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_constraint_worker" (
    "id" SERIAL NOT NULL,
    "worker_constraint_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "worker_constraint_worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_constraint_tenant_id_idx" ON "post_constraint"("tenant_id");

-- CreateIndex
CREATE INDEX "post_constraint_post_constraint_type_id_idx" ON "post_constraint"("post_constraint_type_id");

-- CreateIndex
CREATE INDEX "post_constraint_post_post_constraint_id_idx" ON "post_constraint_post"("post_constraint_id");

-- CreateIndex
CREATE INDEX "post_constraint_post_post_id_idx" ON "post_constraint_post"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_constraint_post_post_constraint_id_post_id_key" ON "post_constraint_post"("post_constraint_id", "post_id");

-- CreateIndex
CREATE INDEX "worker_constraint_tenant_id_idx" ON "worker_constraint"("tenant_id");

-- CreateIndex
CREATE INDEX "worker_constraint_worker_constraint_type_id_idx" ON "worker_constraint"("worker_constraint_type_id");

-- CreateIndex
CREATE INDEX "worker_constraint_worker_worker_constraint_id_idx" ON "worker_constraint_worker"("worker_constraint_id");

-- CreateIndex
CREATE INDEX "worker_constraint_worker_worker_id_idx" ON "worker_constraint_worker"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_constraint_worker_worker_constraint_id_worker_id_key" ON "worker_constraint_worker"("worker_constraint_id", "worker_id");

-- AddForeignKey
ALTER TABLE "post_constraint" ADD CONSTRAINT "post_constraint_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint" ADD CONSTRAINT "post_constraint_post_constraint_type_id_fkey" FOREIGN KEY ("post_constraint_type_id") REFERENCES "post_constraint_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint_post" ADD CONSTRAINT "post_constraint_post_post_constraint_id_fkey" FOREIGN KEY ("post_constraint_id") REFERENCES "post_constraint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint_post" ADD CONSTRAINT "post_constraint_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint" ADD CONSTRAINT "worker_constraint_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint" ADD CONSTRAINT "worker_constraint_worker_constraint_type_id_fkey" FOREIGN KEY ("worker_constraint_type_id") REFERENCES "worker_constraint_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint_worker" ADD CONSTRAINT "worker_constraint_worker_worker_constraint_id_fkey" FOREIGN KEY ("worker_constraint_id") REFERENCES "worker_constraint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint_worker" ADD CONSTRAINT "worker_constraint_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
