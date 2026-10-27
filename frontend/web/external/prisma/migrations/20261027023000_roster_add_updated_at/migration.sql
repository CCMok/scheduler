-- AlterTable
ALTER TABLE "roster" ADD COLUMN "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill from created_at so conflict baseline matches create time
UPDATE "roster" SET "updated_at" = "created_at";

-- AlterTable
ALTER TABLE "roster_audit" ADD COLUMN "updated_at" TIMESTAMPTZ(3);
