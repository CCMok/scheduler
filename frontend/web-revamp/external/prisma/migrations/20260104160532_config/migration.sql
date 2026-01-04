-- AlterTable
ALTER TABLE "team" ADD COLUMN     "max_worker_assign_per_roster" INTEGER;

-- AlterTable
ALTER TABLE "team_audit" ADD COLUMN     "max_worker_assign_per_roster" INTEGER;

CREATE OR REPLACE FUNCTION team_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO team_audit (audit_action, id, owner_id, name, max_worker_assign_per_roster)
        VALUES (TG_OP, OLD.id, OLD.owner_id, OLD.name, OLD.max_worker_assign_per_roster);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO team_audit (audit_action, id, owner_id, name, max_worker_assign_per_roster)
        VALUES (TG_OP, NEW.id, NEW.owner_id, NEW.name, NEW.max_worker_assign_per_roster);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "post_affinity" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "post_affinity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_affinity_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "team_id" INTEGER,

    CONSTRAINT "post_affinity_audit_pkey" PRIMARY KEY ("audit_id")
);



-- CreateTable
CREATE TABLE "post_affinity_member" (
    "id" SERIAL NOT NULL,
    "post_affinity_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "post_affinity_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_affinity_member_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "post_affinity_id" INTEGER,
    "post_id" INTEGER,

    CONSTRAINT "post_affinity_member_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "worker_affinity" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "worker_affinity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_affinity_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "team_id" INTEGER,

    CONSTRAINT "worker_affinity_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "worker_affinity_member" (
    "id" SERIAL NOT NULL,
    "worker_affinity_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "worker_affinity_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_affinity_member_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "worker_affinity_id" INTEGER,
    "worker_id" INTEGER,

    CONSTRAINT "worker_affinity_member_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateIndex
CREATE INDEX "post_affinity_team_id_idx" ON "post_affinity"("team_id");

-- CreateIndex
CREATE INDEX "post_affinity_member_post_affinity_id_idx" ON "post_affinity_member"("post_affinity_id");

-- CreateIndex
CREATE INDEX "post_affinity_member_post_id_idx" ON "post_affinity_member"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_affinity_member_post_affinity_id_post_id_key" ON "post_affinity_member"("post_affinity_id", "post_id");

-- CreateIndex
CREATE INDEX "worker_affinity_team_id_idx" ON "worker_affinity"("team_id");

-- CreateIndex
CREATE INDEX "worker_affinity_member_worker_affinity_id_idx" ON "worker_affinity_member"("worker_affinity_id");

-- CreateIndex
CREATE INDEX "worker_affinity_member_worker_id_idx" ON "worker_affinity_member"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_affinity_member_worker_affinity_id_worker_id_key" ON "worker_affinity_member"("worker_affinity_id", "worker_id");

-- AddForeignKey
ALTER TABLE "post_affinity" ADD CONSTRAINT "post_affinity_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_affinity_member" ADD CONSTRAINT "post_affinity_member_post_affinity_id_fkey" FOREIGN KEY ("post_affinity_id") REFERENCES "post_affinity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_affinity_member" ADD CONSTRAINT "post_affinity_member_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_affinity" ADD CONSTRAINT "worker_affinity_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_affinity_member" ADD CONSTRAINT "worker_affinity_member_worker_affinity_id_fkey" FOREIGN KEY ("worker_affinity_id") REFERENCES "worker_affinity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_affinity_member" ADD CONSTRAINT "worker_affinity_member_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create audit trigger function for post_affinity
CREATE OR REPLACE FUNCTION post_affinity_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_affinity_audit (audit_action, id, team_id)
        VALUES (TG_OP, OLD.id, OLD.team_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_affinity_audit (audit_action, id, team_id)
        VALUES (TG_OP, NEW.id, NEW.team_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_affinity_audit
AFTER INSERT OR UPDATE OR DELETE ON post_affinity
FOR EACH ROW EXECUTE FUNCTION post_affinity_audit_trigger();

-- Create audit trigger function for post_affinity_member
CREATE OR REPLACE FUNCTION post_affinity_member_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_affinity_member_audit (audit_action, id, post_affinity_id, post_id)
        VALUES (TG_OP, OLD.id, OLD.post_affinity_id, OLD.post_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_affinity_member_audit (audit_action, id, post_affinity_id, post_id)
        VALUES (TG_OP, NEW.id, NEW.post_affinity_id, NEW.post_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_affinity_member_audit
AFTER INSERT OR UPDATE OR DELETE ON post_affinity_member
FOR EACH ROW EXECUTE FUNCTION post_affinity_member_audit_trigger();

-- Create audit trigger function for worker_affinity
CREATE OR REPLACE FUNCTION worker_affinity_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_affinity_audit (audit_action, id, team_id)
        VALUES (TG_OP, OLD.id, OLD.team_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_affinity_audit (audit_action, id, team_id)
        VALUES (TG_OP, NEW.id, NEW.team_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER worker_affinity_audit
AFTER INSERT OR UPDATE OR DELETE ON worker_affinity
FOR EACH ROW EXECUTE FUNCTION worker_affinity_audit_trigger();

-- Create audit trigger function for worker_affinity_member
CREATE OR REPLACE FUNCTION worker_affinity_member_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_affinity_member_audit (audit_action, id, worker_affinity_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.worker_affinity_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_affinity_member_audit (audit_action, id, worker_affinity_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.worker_affinity_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER worker_affinity_member_audit
AFTER INSERT OR UPDATE OR DELETE ON worker_affinity_member
FOR EACH ROW EXECUTE FUNCTION worker_affinity_member_audit_trigger();
