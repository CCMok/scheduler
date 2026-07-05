/*
  Warnings:

  - You are about to drop the column `roster_worker_id` on the `roster_timeslot_off_worker` table. All the data in the column will be lost.
  - You are about to drop the column `roster_worker_id` on the `roster_timeslot_off_worker_audit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roster_timeslot_id,worker_id]` on the table `roster_timeslot_off_worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `worker_id` to the `roster_timeslot_off_worker` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "roster_timeslot_off_worker_roster_timeslot_id_roster_worker_key";

-- DropIndex
DROP INDEX "roster_timeslot_off_worker_roster_worker_id_idx";

-- AlterTable
ALTER TABLE "roster_timeslot_off_worker" DROP COLUMN "roster_worker_id",
ADD COLUMN     "worker_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "roster_timeslot_off_worker_audit" DROP COLUMN "roster_worker_id",
ADD COLUMN     "worker_id" INTEGER;

-- CreateIndex
CREATE INDEX "roster_timeslot_off_worker_worker_id_idx" ON "roster_timeslot_off_worker"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_timeslot_off_worker_roster_timeslot_id_worker_id_key" ON "roster_timeslot_off_worker"("roster_timeslot_id", "worker_id");

-- audit
CREATE OR REPLACE FUNCTION roster_timeslot_off_worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_timeslot_off_worker_audit (audit_action, id, roster_timeslot_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.roster_timeslot_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_timeslot_off_worker_audit (audit_action, id, roster_timeslot_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.roster_timeslot_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;