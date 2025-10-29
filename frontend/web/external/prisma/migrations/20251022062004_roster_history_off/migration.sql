-- CreateTable
CREATE TABLE "roster_history_off_worker" (
    "id" SERIAL NOT NULL,
    "roster_history_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "roster_history_off_worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_history_off_worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_history_id" INTEGER,
    "worker_id" INTEGER,

    CONSTRAINT "roster_history_off_worker_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "roster_history_off_worker_day" (
    "id" SERIAL NOT NULL,
    "roster_history_off_worker_id" INTEGER NOT NULL,
    "day" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "roster_history_off_worker_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_history_off_worker_day_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_history_off_worker_id" INTEGER,
    "day" TIMESTAMPTZ(3),

    CONSTRAINT "roster_history_off_worker_day_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateIndex
CREATE INDEX "roster_history_off_worker_roster_history_id_idx" ON "roster_history_off_worker"("roster_history_id");

-- CreateIndex
CREATE INDEX "roster_history_off_worker_worker_id_idx" ON "roster_history_off_worker"("worker_id");

-- CreateIndex
CREATE INDEX "roster_history_off_worker_day_roster_history_off_worker_id_idx" ON "roster_history_off_worker_day"("roster_history_off_worker_id");

-- AddForeignKey
ALTER TABLE "roster_history_off_worker" ADD CONSTRAINT "roster_history_off_worker_roster_history_id_fkey" FOREIGN KEY ("roster_history_id") REFERENCES "roster_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_history_off_worker" ADD CONSTRAINT "roster_history_off_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_history_off_worker_day" ADD CONSTRAINT "roster_history_off_worker_day_roster_history_off_worker_id_fkey" FOREIGN KEY ("roster_history_off_worker_id") REFERENCES "roster_history_off_worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create trigger functions for audit tables
CREATE OR REPLACE FUNCTION roster_history_off_worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_history_off_worker_audit (audit_action, id, roster_history_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.roster_history_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_history_off_worker_audit (audit_action, id, roster_history_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.roster_history_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION roster_history_off_worker_day_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_history_off_worker_day_audit (audit_action, id, roster_history_off_worker_id, day)
        VALUES (TG_OP, OLD.id, OLD.roster_history_off_worker_id, OLD.day);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_history_off_worker_day_audit (audit_action, id, roster_history_off_worker_id, day)
        VALUES (TG_OP, NEW.id, NEW.roster_history_off_worker_id, NEW.day);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER roster_history_off_worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_history_off_worker"
    FOR EACH ROW EXECUTE FUNCTION roster_history_off_worker_audit_trigger();

CREATE TRIGGER roster_history_off_worker_day_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_history_off_worker_day"
    FOR EACH ROW EXECUTE FUNCTION roster_history_off_worker_day_audit_trigger();