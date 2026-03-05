-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "name" TEXT,

    CONSTRAINT "role_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION role_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO role_audit (audit_action, id, name)
        VALUES (TG_OP, OLD.id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO role_audit (audit_action, id, name)
        VALUES (TG_OP, NEW.id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER role_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "role"
    FOR EACH ROW EXECUTE FUNCTION role_audit_trigger();

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "email" TEXT,
    "password" TEXT,
    "name" TEXT,
    "role_id" INTEGER,

    CONSTRAINT "user_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION user_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO user_audit (audit_action, id, email, password, name, role_id)
        VALUES (TG_OP, OLD.id, OLD.email, OLD.password, OLD.name, OLD.role_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO user_audit (audit_action, id, email, password, name, role_id)
        VALUES (TG_OP, NEW.id, NEW.email, NEW.password, NEW.name, NEW.role_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "user"
    FOR EACH ROW EXECUTE FUNCTION user_audit_trigger();

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "max_worker_assign_per_roster" INTEGER,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "owner_id" INTEGER,
    "name" TEXT,
    "max_worker_assign_per_roster" INTEGER,

    CONSTRAINT "team_audit_pkey" PRIMARY KEY ("audit_id")
);

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

CREATE TRIGGER team_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "team"
    FOR EACH ROW EXECUTE FUNCTION team_audit_trigger();

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "team_id" INTEGER,
    "name" TEXT,
    "display_order" INTEGER,

    CONSTRAINT "post_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION post_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_audit (audit_action, id, team_id, name, display_order)
        VALUES (TG_OP, OLD.id, OLD.team_id, OLD.name, OLD.display_order);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_audit (audit_action, id, team_id, name, display_order)
        VALUES (TG_OP, NEW.id, NEW.team_id, NEW.name, NEW.display_order);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post"
    FOR EACH ROW EXECUTE FUNCTION post_audit_trigger();

-- CreateTable
CREATE TABLE "worker" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "team_id" INTEGER,
    "name" TEXT,

    CONSTRAINT "worker_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_audit (audit_action, id, team_id, name)
        VALUES (TG_OP, OLD.id, OLD.team_id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_audit (audit_action, id, team_id, name)
        VALUES (TG_OP, NEW.id, NEW.team_id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "worker"
    FOR EACH ROW EXECUTE FUNCTION worker_audit_trigger();

-- CreateTable
CREATE TABLE "post_worker" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "post_worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "post_id" INTEGER,
    "worker_id" INTEGER,
    "priority" INTEGER,

    CONSTRAINT "post_worker_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION post_worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_worker_audit (audit_action, id, post_id, worker_id, priority)
        VALUES (TG_OP, OLD.id, OLD.post_id, OLD.worker_id, OLD.priority);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_worker_audit (audit_action, id, post_id, worker_id, priority)
        VALUES (TG_OP, NEW.id, NEW.post_id, NEW.worker_id, NEW.priority);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post_worker"
    FOR EACH ROW EXECUTE FUNCTION post_worker_audit_trigger();

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

CREATE TRIGGER post_affinity_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post_affinity"
    FOR EACH ROW EXECUTE FUNCTION post_affinity_audit_trigger();

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

CREATE TRIGGER post_affinity_member_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post_affinity_member"
    FOR EACH ROW EXECUTE FUNCTION post_affinity_member_audit_trigger();

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

CREATE TRIGGER worker_affinity_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "worker_affinity"
    FOR EACH ROW EXECUTE FUNCTION worker_affinity_audit_trigger();

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

CREATE TRIGGER worker_affinity_member_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "worker_affinity_member"
    FOR EACH ROW EXECUTE FUNCTION worker_affinity_member_audit_trigger();

-- CreateTable
CREATE TABLE "roster" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "team_id" INTEGER,
    "name" TEXT,
    "created_at" TIMESTAMPTZ(3),

    CONSTRAINT "roster_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION roster_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_audit (audit_action, id, team_id, name, created_at)
        VALUES (TG_OP, OLD.id, OLD.team_id, OLD.name, OLD.created_at);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_audit (audit_action, id, team_id, name, created_at)
        VALUES (TG_OP, NEW.id, NEW.team_id, NEW.name, NEW.created_at);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster"
    FOR EACH ROW EXECUTE FUNCTION roster_audit_trigger();

-- CreateTable
CREATE TABLE "roster_post" (
    "id" SERIAL NOT NULL,
    "roster_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "fallback_name" TEXT NOT NULL,

    CONSTRAINT "roster_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_post_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_id" INTEGER,
    "post_id" INTEGER,
    "fallback_name" TEXT,

    CONSTRAINT "roster_post_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION roster_post_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_post_audit (audit_action, id, roster_id, post_id, fallback_name)
        VALUES (TG_OP, OLD.id, OLD.roster_id, OLD.post_id, OLD.fallback_name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_post_audit (audit_action, id, roster_id, post_id, fallback_name)
        VALUES (TG_OP, NEW.id, NEW.roster_id, NEW.post_id, NEW.fallback_name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_post_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_post"
    FOR EACH ROW EXECUTE FUNCTION roster_post_audit_trigger();

-- CreateTable
CREATE TABLE "roster_worker" (
    "id" SERIAL NOT NULL,
    "roster_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "fallback_name" TEXT NOT NULL,

    CONSTRAINT "roster_worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_id" INTEGER,
    "worker_id" INTEGER,
    "fallback_name" TEXT,

    CONSTRAINT "roster_worker_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION roster_worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_worker_audit (audit_action, id, roster_id, worker_id, fallback_name)
        VALUES (TG_OP, OLD.id, OLD.roster_id, OLD.worker_id, OLD.fallback_name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_worker_audit (audit_action, id, roster_id, worker_id, fallback_name)
        VALUES (TG_OP, NEW.id, NEW.roster_id, NEW.worker_id, NEW.fallback_name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_worker"
    FOR EACH ROW EXECUTE FUNCTION roster_worker_audit_trigger();

-- CreateTable
CREATE TABLE "roster_timeslot" (
    "id" SERIAL NOT NULL,
    "roster_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roster_timeslot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_timeslot_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_id" INTEGER,
    "name" TEXT,

    CONSTRAINT "roster_timeslot_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION roster_timeslot_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_timeslot_audit (audit_action, id, roster_id, name)
        VALUES (TG_OP, OLD.id, OLD.roster_id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_timeslot_audit (audit_action, id, roster_id, name)
        VALUES (TG_OP, NEW.id, NEW.roster_id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_timeslot_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_timeslot"
    FOR EACH ROW EXECUTE FUNCTION roster_timeslot_audit_trigger();

-- CreateTable
CREATE TABLE "roster_post_timeslot" (
    "id" SERIAL NOT NULL,
    "roster_post_id" INTEGER NOT NULL,
    "roster_timeslot_id" INTEGER NOT NULL,
    "worker_id" INTEGER,

    CONSTRAINT "roster_post_timeslot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_post_timeslot_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_post_id" INTEGER,
    "roster_timeslot_id" INTEGER,
    "worker_id" INTEGER,

    CONSTRAINT "roster_post_timeslot_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION roster_post_timeslot_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_post_timeslot_audit (audit_action, id, roster_post_id, roster_timeslot_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.roster_post_id, OLD.roster_timeslot_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_post_timeslot_audit (audit_action, id, roster_post_id, roster_timeslot_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.roster_post_id, NEW.roster_timeslot_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_post_timeslot_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_post_timeslot"
    FOR EACH ROW EXECUTE FUNCTION roster_post_timeslot_audit_trigger();

-- CreateTable
CREATE TABLE "roster_worker_off_timeslot" (
    "id" SERIAL NOT NULL,
    "roster_worker_id" INTEGER NOT NULL,
    "roster_timeslot_id" INTEGER NOT NULL,

    CONSTRAINT "roster_worker_off_timeslot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_worker_off_timeslot_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_worker_id" INTEGER,
    "roster_timeslot_id" INTEGER,

    CONSTRAINT "roster_worker_off_timeslot_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION roster_worker_off_timeslot_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_worker_off_timeslot_audit (audit_action, id, roster_worker_id, roster_timeslot_id)
        VALUES (TG_OP, OLD.id, OLD.roster_worker_id, OLD.roster_timeslot_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_worker_off_timeslot_audit (audit_action, id, roster_worker_id, roster_timeslot_id)
        VALUES (TG_OP, NEW.id, NEW.roster_worker_id, NEW.roster_timeslot_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roster_worker_off_timeslot_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_worker_off_timeslot"
    FOR EACH ROW EXECUTE FUNCTION roster_worker_off_timeslot_audit_trigger();

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_id_idx" ON "user"("role_id");

-- CreateIndex
CREATE INDEX "team_owner_id_idx" ON "team"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_owner_id_name_key" ON "team"("owner_id", "name");

-- CreateIndex
CREATE INDEX "post_team_id_idx" ON "post"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_team_id_name_key" ON "post"("team_id", "name");

-- CreateIndex
CREATE INDEX "worker_team_id_idx" ON "worker"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_team_id_name_key" ON "worker"("team_id", "name");

-- CreateIndex
CREATE INDEX "post_worker_post_id_idx" ON "post_worker"("post_id");

-- CreateIndex
CREATE INDEX "post_worker_worker_id_idx" ON "post_worker"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_worker_post_id_worker_id_key" ON "post_worker"("post_id", "worker_id");

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

-- CreateIndex
CREATE INDEX "roster_team_id_idx" ON "roster"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_team_id_name_key" ON "roster"("team_id", "name");

-- CreateIndex
CREATE INDEX "roster_post_roster_id_idx" ON "roster_post"("roster_id");

-- CreateIndex
CREATE INDEX "roster_post_post_id_idx" ON "roster_post"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_post_roster_id_post_id_key" ON "roster_post"("roster_id", "post_id");

-- CreateIndex
CREATE INDEX "roster_worker_roster_id_idx" ON "roster_worker"("roster_id");

-- CreateIndex
CREATE INDEX "roster_worker_worker_id_idx" ON "roster_worker"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_worker_roster_id_worker_id_key" ON "roster_worker"("roster_id", "worker_id");

-- CreateIndex
CREATE INDEX "roster_timeslot_roster_id_idx" ON "roster_timeslot"("roster_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_timeslot_roster_id_name_key" ON "roster_timeslot"("roster_id", "name");

-- CreateIndex
CREATE INDEX "roster_post_timeslot_roster_post_id_idx" ON "roster_post_timeslot"("roster_post_id");

-- CreateIndex
CREATE INDEX "roster_post_timeslot_roster_timeslot_id_idx" ON "roster_post_timeslot"("roster_timeslot_id");

-- CreateIndex
CREATE INDEX "roster_post_timeslot_worker_id_idx" ON "roster_post_timeslot"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_post_timeslot_roster_post_id_roster_timeslot_id_key" ON "roster_post_timeslot"("roster_post_id", "roster_timeslot_id");

-- CreateIndex
CREATE INDEX "roster_worker_off_timeslot_roster_worker_id_idx" ON "roster_worker_off_timeslot"("roster_worker_id");

-- CreateIndex
CREATE INDEX "roster_worker_off_timeslot_roster_timeslot_id_idx" ON "roster_worker_off_timeslot"("roster_timeslot_id");

-- CreateIndex
CREATE UNIQUE INDEX "roster_worker_off_timeslot_roster_worker_id_roster_timeslot_key" ON "roster_worker_off_timeslot"("roster_worker_id", "roster_timeslot_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "roster" ADD CONSTRAINT "roster_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_post" ADD CONSTRAINT "roster_post_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_worker" ADD CONSTRAINT "roster_worker_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_timeslot" ADD CONSTRAINT "roster_timeslot_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_post_timeslot" ADD CONSTRAINT "roster_post_timeslot_roster_post_id_fkey" FOREIGN KEY ("roster_post_id") REFERENCES "roster_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_post_timeslot" ADD CONSTRAINT "roster_post_timeslot_roster_timeslot_id_fkey" FOREIGN KEY ("roster_timeslot_id") REFERENCES "roster_timeslot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_worker_off_timeslot" ADD CONSTRAINT "roster_worker_off_timeslot_roster_worker_id_fkey" FOREIGN KEY ("roster_worker_id") REFERENCES "roster_worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_worker_off_timeslot" ADD CONSTRAINT "roster_worker_off_timeslot_roster_timeslot_id_fkey" FOREIGN KEY ("roster_timeslot_id") REFERENCES "roster_timeslot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
