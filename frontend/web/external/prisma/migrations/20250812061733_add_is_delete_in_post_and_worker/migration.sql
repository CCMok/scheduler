-- AlterTable
ALTER TABLE "public"."post" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."worker" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
