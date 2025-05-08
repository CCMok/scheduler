/*
  Warnings:

  - A unique constraint covering the columns `[enum]` on the table `post_constraint_type` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enum]` on the table `worker_constraint_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enum` to the `post_constraint_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enum` to the `worker_constraint_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post_constraint_type" ADD COLUMN     "enum" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "worker_constraint_type" ADD COLUMN     "enum" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "post_constraint_type_enum_key" ON "post_constraint_type"("enum");

-- CreateIndex
CREATE UNIQUE INDEX "worker_constraint_type_enum_key" ON "worker_constraint_type"("enum");
