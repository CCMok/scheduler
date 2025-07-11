-- AlterTable
ALTER TABLE "roster_history" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "roster_history_schedule" ALTER COLUMN "day" SET DATA TYPE TIMESTAMPTZ(3);
