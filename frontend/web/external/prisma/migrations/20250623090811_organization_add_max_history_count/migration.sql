-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "max_history_count" INTEGER;

-- AlterTable
ALTER TABLE "roster_history" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
