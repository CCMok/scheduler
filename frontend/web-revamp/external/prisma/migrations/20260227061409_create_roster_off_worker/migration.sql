-- CreateTable
CREATE TABLE "roster_off_worker" (
    "id" SERIAL NOT NULL,
    "roster_id" INTEGER NOT NULL,
    "worker_id" INTEGER,
    "fallback_worker_name" TEXT NOT NULL,

    CONSTRAINT "roster_off_worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_off_worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_id" INTEGER,
    "worker_id" INTEGER,
    "fallback_worker_name" TEXT,

    CONSTRAINT "roster_off_worker_audit_pkey" PRIMARY KEY ("audit_id")
);

-- audit
CREATE OR REPLACE FUNCTION roster_off_worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_off_worker_audit (audit_action, id, roster_id, worker_id, fallback_worker_name)
        VALUES (TG_OP, OLD.id, OLD.roster_id, OLD.worker_id, OLD.fallback_worker_name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_off_worker_audit (audit_action, id, roster_id, worker_id, fallback_worker_name)
        VALUES (TG_OP, NEW.id, NEW.roster_id, NEW.worker_id, NEW.fallback_worker_name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_off_worker_audit
AFTER INSERT OR UPDATE OR DELETE ON roster_off_worker
FOR EACH ROW EXECUTE FUNCTION roster_off_worker_audit_trigger();

-- CreateTable
CREATE TABLE "roster_off_worker_timeslot" (
    "id" SERIAL NOT NULL,
    "roster_off_worker_id" INTEGER NOT NULL,
    "timeslot" TEXT NOT NULL,

    CONSTRAINT "roster_off_worker_timeslot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_off_worker_timeslot_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_off_worker_id" INTEGER,
    "timeslot" TEXT,

    CONSTRAINT "roster_off_worker_timeslot_audit_pkey" PRIMARY KEY ("audit_id")
);

-- audit
CREATE OR REPLACE FUNCTION roster_off_worker_timeslot_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_off_worker_timeslot_audit (audit_action, id, roster_off_worker_id, timeslot)
        VALUES (TG_OP, OLD.id, OLD.roster_off_worker_id, OLD.timeslot);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_off_worker_timeslot_audit (audit_action, id, roster_off_worker_id, timeslot)
        VALUES (TG_OP, NEW.id, NEW.roster_off_worker_id, NEW.timeslot);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_off_worker_timeslot_audit
AFTER INSERT OR UPDATE OR DELETE ON roster_off_worker_timeslot
FOR EACH ROW EXECUTE FUNCTION roster_off_worker_timeslot_audit_trigger();

-- CreateIndex
CREATE INDEX "roster_off_worker_roster_id_idx" ON "roster_off_worker"("roster_id");

-- CreateIndex
CREATE INDEX "roster_off_worker_worker_id_idx" ON "roster_off_worker"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_off_worker_roster_id_worker_id_key" ON "roster_off_worker"("roster_id", "worker_id");

-- CreateIndex
CREATE INDEX "roster_off_worker_timeslot_roster_off_worker_id_idx" ON "roster_off_worker_timeslot"("roster_off_worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_off_worker_timeslot_roster_off_worker_id_timeslot_key" ON "roster_off_worker_timeslot"("roster_off_worker_id", "timeslot");

-- AddForeignKey
ALTER TABLE "roster_off_worker" ADD CONSTRAINT "roster_off_worker_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_off_worker_timeslot" ADD CONSTRAINT "roster_off_worker_timeslot_roster_off_worker_id_fkey" FOREIGN KEY ("roster_off_worker_id") REFERENCES "roster_off_worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
