/*
  Warnings:

  - You are about to drop the `roster_post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roster_post_audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roster_post_timeslot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roster_post_timeslot_audit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "roster_post" DROP CONSTRAINT "roster_post_roster_id_fkey";

-- DropForeignKey
ALTER TABLE "roster_post_timeslot" DROP CONSTRAINT "roster_post_timeslot_roster_post_id_fkey";

-- DropForeignKey
ALTER TABLE "roster_post_timeslot" DROP CONSTRAINT "roster_post_timeslot_roster_timeslot_id_fkey";

-- DropTable
DROP TABLE "roster_post";

-- DropTable
DROP TABLE "roster_post_audit";

-- DropTable
DROP TABLE "roster_post_timeslot";

-- DropTable
DROP TABLE "roster_post_timeslot_audit";

-- DropTrigger
DROP FUNCTION IF EXISTS roster_post_audit_trigger() CASCADE;

DROP FUNCTION IF EXISTS roster_post_timeslot_audit_trigger() CASCADE;

-- CreateTable
CREATE TABLE "roster_timeslot_post" (
    "id" SERIAL NOT NULL,
    "roster_timeslot_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "worker_id" INTEGER,

    CONSTRAINT "roster_timeslot_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_timeslot_post_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_timeslot_id" INTEGER,
    "post_id" INTEGER,
    "worker_id" INTEGER,

    CONSTRAINT "roster_timeslot_post_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION roster_timeslot_post_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_timeslot_post_audit (audit_action, id, roster_timeslot_id, post_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.roster_timeslot_id, OLD.post_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_timeslot_post_audit (audit_action, id, roster_timeslot_id, post_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.roster_timeslot_id, NEW.post_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_timeslot_post_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_timeslot_post"
    FOR EACH ROW EXECUTE FUNCTION roster_timeslot_post_audit_trigger();

-- CreateIndex
CREATE INDEX "roster_timeslot_post_roster_timeslot_id_idx" ON "roster_timeslot_post"("roster_timeslot_id");

-- CreateIndex
CREATE INDEX "roster_timeslot_post_post_id_idx" ON "roster_timeslot_post"("post_id");

-- CreateIndex
CREATE INDEX "roster_timeslot_post_worker_id_idx" ON "roster_timeslot_post"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_timeslot_post_roster_timeslot_id_post_id_key" ON "roster_timeslot_post"("roster_timeslot_id", "post_id");

-- AddForeignKey
ALTER TABLE "roster_timeslot_post" ADD CONSTRAINT "roster_timeslot_post_roster_timeslot_id_fkey" FOREIGN KEY ("roster_timeslot_id") REFERENCES "roster_timeslot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
