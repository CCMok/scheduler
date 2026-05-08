/*
  Warnings:

  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_audit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_fkey";

-- DropIndex
DROP INDEX "user_role_id_idx";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "role_audit";

-- DropFunction
DROP FUNCTION IF EXISTS "role_audit_trigger";