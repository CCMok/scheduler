/*
  Warnings:

  - You are about to drop the `roster_off_worker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roster_off_worker_audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roster_off_worker_timeslot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roster_off_worker_timeslot_audit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "roster_off_worker" DROP CONSTRAINT "roster_off_worker_roster_id_fkey";

-- DropForeignKey
ALTER TABLE "roster_off_worker_timeslot" DROP CONSTRAINT "roster_off_worker_timeslot_roster_off_worker_id_fkey";

-- DropTable
DROP TABLE "roster_off_worker";

-- DropTable
DROP TABLE "roster_off_worker_audit";

-- DropTable
DROP TABLE "roster_off_worker_timeslot";

-- DropTable
DROP TABLE "roster_off_worker_timeslot_audit";

DROP FUNCTION IF EXISTS roster_off_worker_audit_trigger();

DROP FUNCTION IF EXISTS roster_off_worker_timeslot_audit_trigger();

-- CreateTable
CREATE TABLE "roster_timeslot_off" (
    "id" SERIAL NOT NULL,
    "roster_timeslot_off_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "fallback_worker_name" TEXT NOT NULL,

    CONSTRAINT "roster_timeslot_off_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_timeslot_off_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_timeslot_off_id" INTEGER,
    "worker_id" INTEGER,
    "fallback_worker_name" TEXT,

    CONSTRAINT "roster_timeslot_off_audit_pkey" PRIMARY KEY ("audit_id")
);

-- audit
CREATE OR REPLACE FUNCTION roster_timeslot_off_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_timeslot_off_audit (audit_action, id, roster_timeslot_off_id, worker_id, fallback_worker_name)
        VALUES (TG_OP, OLD.id, OLD.roster_timeslot_off_id, OLD.worker_id, OLD.fallback_worker_name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_timeslot_off_audit (audit_action, id, roster_timeslot_off_id, worker_id, fallback_worker_name)
        VALUES (TG_OP, NEW.id, NEW.roster_timeslot_off_id, NEW.worker_id, NEW.fallback_worker_name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_timeslot_off_audit
AFTER INSERT OR UPDATE OR DELETE ON roster_timeslot_off
FOR EACH ROW EXECUTE FUNCTION roster_timeslot_off_audit_trigger();

-- CreateIndex
CREATE INDEX "roster_timeslot_off_roster_timeslot_off_id_idx" ON "roster_timeslot_off"("roster_timeslot_off_id");

-- CreateIndex
CREATE INDEX "roster_timeslot_off_worker_id_idx" ON "roster_timeslot_off"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_timeslot_off_roster_timeslot_off_id_worker_id_key" ON "roster_timeslot_off"("roster_timeslot_off_id", "worker_id");

-- AddForeignKey
ALTER TABLE "roster_timeslot_off" ADD CONSTRAINT "roster_timeslot_off_roster_timeslot_off_id_fkey" FOREIGN KEY ("roster_timeslot_off_id") REFERENCES "roster_timeslot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
