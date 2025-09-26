-- AlterTable
ALTER TABLE "public"."post_constraint" ALTER COLUMN "weighting" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."post_constraint_audit" ALTER COLUMN "weighting" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."worker_constraint" ALTER COLUMN "weighting" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."worker_constraint_audit" ALTER COLUMN "weighting" SET DATA TYPE DECIMAL(65,30);
