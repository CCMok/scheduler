/*
  Warnings:

  - You are about to drop the `constraint_setting` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tenant_id,name]` on the table `post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id,name]` on the table `worker` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "constraint_setting" DROP CONSTRAINT "constraint_setting_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "constraint_setting_post" DROP CONSTRAINT "constraint_setting_post_constraint_setting_id_fkey";

-- DropForeignKey
ALTER TABLE "constraint_setting_worker" DROP CONSTRAINT "constraint_setting_worker_constraint_setting_id_fkey";

-- DropTable
DROP TABLE "constraint_setting";

-- CreateTable
CREATE TABLE "post_constraint_setting" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "constraint_type_id" INTEGER NOT NULL,
    "weighting" INTEGER NOT NULL,

    CONSTRAINT "post_constraint_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_constraint_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "post_constraint_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_constraint_setting" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "constraint_type_id" INTEGER NOT NULL,
    "weighting" INTEGER NOT NULL,

    CONSTRAINT "worker_constraint_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_constraint_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "worker_constraint_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_constraint_setting_tenant_id_idx" ON "post_constraint_setting"("tenant_id");

-- CreateIndex
CREATE INDEX "post_constraint_setting_constraint_type_id_idx" ON "post_constraint_setting"("constraint_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_constraint_type_name_key" ON "post_constraint_type"("name");

-- CreateIndex
CREATE INDEX "worker_constraint_setting_tenant_id_idx" ON "worker_constraint_setting"("tenant_id");

-- CreateIndex
CREATE INDEX "worker_constraint_setting_constraint_type_id_idx" ON "worker_constraint_setting"("constraint_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_constraint_setting_tenant_id_constraint_type_id_key" ON "worker_constraint_setting"("tenant_id", "constraint_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_constraint_type_name_key" ON "worker_constraint_type"("name");

-- CreateIndex
CREATE INDEX "post_tenant_id_idx" ON "post"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_tenant_id_name_key" ON "post"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "post_worker_post_id_idx" ON "post_worker"("post_id");

-- CreateIndex
CREATE INDEX "post_worker_worker_id_idx" ON "post_worker"("worker_id");

-- CreateIndex
CREATE INDEX "worker_tenant_id_idx" ON "worker"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_tenant_id_name_key" ON "worker"("tenant_id", "name");

-- AddForeignKey
ALTER TABLE "post_constraint_setting" ADD CONSTRAINT "post_constraint_setting_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint_setting" ADD CONSTRAINT "post_constraint_setting_constraint_type_id_fkey" FOREIGN KEY ("constraint_type_id") REFERENCES "post_constraint_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraint_setting_post" ADD CONSTRAINT "constraint_setting_post_constraint_setting_id_fkey" FOREIGN KEY ("constraint_setting_id") REFERENCES "post_constraint_setting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint_setting" ADD CONSTRAINT "worker_constraint_setting_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint_setting" ADD CONSTRAINT "worker_constraint_setting_constraint_type_id_fkey" FOREIGN KEY ("constraint_type_id") REFERENCES "worker_constraint_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraint_setting_worker" ADD CONSTRAINT "constraint_setting_worker_constraint_setting_id_fkey" FOREIGN KEY ("constraint_setting_id") REFERENCES "worker_constraint_setting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
