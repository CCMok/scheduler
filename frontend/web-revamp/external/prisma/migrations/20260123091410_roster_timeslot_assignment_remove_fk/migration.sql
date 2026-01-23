/*
  Warnings:

  - Made the column `post_id` on table `roster_timeslot_assignment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "roster_timeslot_assignment" DROP CONSTRAINT "roster_timeslot_assignment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "roster_timeslot_assignment" DROP CONSTRAINT "roster_timeslot_assignment_worker_id_fkey";

-- AlterTable
ALTER TABLE "roster_timeslot_assignment" ALTER COLUMN "post_id" SET NOT NULL;
