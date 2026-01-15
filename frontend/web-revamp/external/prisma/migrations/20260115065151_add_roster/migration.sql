-- CreateTable
CREATE TABLE "roster" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "team_id" INTEGER,

    CONSTRAINT "roster_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "roster_timeslot" (
    "id" SERIAL NOT NULL,
    "roster_id" INTEGER NOT NULL,
    "timeslot" TEXT NOT NULL,

    CONSTRAINT "roster_timeslot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_timeslot_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_id" INTEGER,
    "timeslot" TEXT,

    CONSTRAINT "roster_timeslot_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "roster_timeslot_assignement" (
    "id" SERIAL NOT NULL,
    "roster_timeslot_id" INTEGER NOT NULL,
    "post_id" INTEGER,
    "worker_id" INTEGER,
    "fallback_post_name" TEXT NOT NULL,
    "fallback_worker_name" TEXT,

    CONSTRAINT "roster_timeslot_assignement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_timeslot_assignement_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_timeslot_id" INTEGER,
    "post_id" INTEGER,
    "worker_id" INTEGER,
    "fallback_post_name" TEXT,
    "fallback_worker_name" TEXT,

    CONSTRAINT "roster_timeslot_assignement_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateIndex
CREATE INDEX "roster_team_id_idx" ON "roster"("team_id");

-- CreateIndex
CREATE INDEX "roster_timeslot_roster_id_idx" ON "roster_timeslot"("roster_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_timeslot_roster_id_timeslot_key" ON "roster_timeslot"("roster_id", "timeslot");

-- CreateIndex
CREATE INDEX "roster_timeslot_assignement_roster_timeslot_id_idx" ON "roster_timeslot_assignement"("roster_timeslot_id");

-- CreateIndex
CREATE INDEX "roster_timeslot_assignement_post_id_idx" ON "roster_timeslot_assignement"("post_id");

-- CreateIndex
CREATE INDEX "roster_timeslot_assignement_worker_id_idx" ON "roster_timeslot_assignement"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_timeslot_assignement_roster_timeslot_id_post_id_key" ON "roster_timeslot_assignement"("roster_timeslot_id", "post_id");

-- AddForeignKey
ALTER TABLE "roster" ADD CONSTRAINT "roster_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_timeslot" ADD CONSTRAINT "roster_timeslot_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_timeslot_assignement" ADD CONSTRAINT "roster_timeslot_assignement_roster_timeslot_id_fkey" FOREIGN KEY ("roster_timeslot_id") REFERENCES "roster_timeslot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_timeslot_assignement" ADD CONSTRAINT "roster_timeslot_assignement_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_timeslot_assignement" ADD CONSTRAINT "roster_timeslot_assignement_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create audit trigger function for roster
CREATE OR REPLACE FUNCTION roster_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_audit (audit_action, id, team_id)
        VALUES (TG_OP, OLD.id, OLD.team_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_audit (audit_action, id, team_id)
        VALUES (TG_OP, NEW.id, NEW.team_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_audit
AFTER INSERT OR UPDATE OR DELETE ON roster
FOR EACH ROW EXECUTE FUNCTION roster_audit_trigger();

-- Create audit trigger function for roster_timeslot
CREATE OR REPLACE FUNCTION roster_timeslot_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_timeslot_audit (audit_action, id, roster_id, timeslot)
        VALUES (TG_OP, OLD.id, OLD.roster_id, OLD.timeslot);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_timeslot_audit (audit_action, id, roster_id, timeslot)
        VALUES (TG_OP, NEW.id, NEW.roster_id, NEW.timeslot);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_timeslot_audit
AFTER INSERT OR UPDATE OR DELETE ON roster_timeslot
FOR EACH ROW EXECUTE FUNCTION roster_timeslot_audit_trigger();

-- Create audit trigger function for roster_timeslot_assignement
CREATE OR REPLACE FUNCTION roster_timeslot_assignement_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_timeslot_assignement_audit (audit_action, id, roster_timeslot_id, post_id, worker_id, fallback_post_name, fallback_worker_name)
        VALUES (TG_OP, OLD.id, OLD.roster_timeslot_id, OLD.post_id, OLD.worker_id, OLD.fallback_post_name, OLD.fallback_worker_name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_timeslot_assignement_audit (audit_action, id, roster_timeslot_id, post_id, worker_id, fallback_post_name, fallback_worker_name)
        VALUES (TG_OP, NEW.id, NEW.roster_timeslot_id, NEW.post_id, NEW.worker_id, NEW.fallback_post_name, NEW.fallback_worker_name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_timeslot_assignement_audit
AFTER INSERT OR UPDATE OR DELETE ON roster_timeslot_assignement
FOR EACH ROW EXECUTE FUNCTION roster_timeslot_assignement_audit_trigger();
