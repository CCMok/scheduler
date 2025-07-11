/*
  Warnings:

  - Changed the type of `day` on the `roster_history_schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "roster_history" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "roster_history_schedule" DROP COLUMN "day",
ADD COLUMN     "day" TIMESTAMP(3) NOT NULL;
