-- CreateTable
CREATE TABLE "public"."user_audit" (
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

-- CreateTable
CREATE TABLE "public"."organization_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "name" TEXT,
    "max_history_count" INTEGER,

    CONSTRAINT "organization_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."user_organization_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "user_id" INTEGER,
    "organization_id" INTEGER,

    CONSTRAINT "user_organization_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."department_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "organization_id" INTEGER,
    "name" TEXT,

    CONSTRAINT "department_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."post_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "department_id" INTEGER,
    "name" TEXT,
    "is_deleted" BOOLEAN,
    "display_position" INTEGER,

    CONSTRAINT "post_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "department_id" INTEGER,
    "name" TEXT,
    "is_deleted" BOOLEAN,

    CONSTRAINT "worker_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."post_worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "post_id" INTEGER,
    "worker_id" INTEGER,

    CONSTRAINT "post_worker_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."post_constraint_type_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "name" TEXT,
    "enum" INTEGER,

    CONSTRAINT "post_constraint_type_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."post_constraint_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "department_id" INTEGER,
    "post_constraint_type_id" INTEGER,
    "weighting" INTEGER,

    CONSTRAINT "post_constraint_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."post_constraint_post_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "post_constraint_id" INTEGER,
    "post_id" INTEGER,

    CONSTRAINT "post_constraint_post_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."worker_constraint_type_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "name" TEXT,
    "enum" INTEGER,

    CONSTRAINT "worker_constraint_type_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."worker_constraint_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "department_id" INTEGER,
    "worker_constraint_type_id" INTEGER,
    "weighting" INTEGER,

    CONSTRAINT "worker_constraint_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."worker_constraint_worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "worker_constraint_id" INTEGER,
    "worker_id" INTEGER,

    CONSTRAINT "worker_constraint_worker_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."roster_history_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "department_id" INTEGER,
    "created_at" TIMESTAMPTZ(3),
    "created_by_user_id" INTEGER,

    CONSTRAINT "roster_history_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."roster_history_schedule_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_history_id" INTEGER,
    "day" TIMESTAMPTZ(3),

    CONSTRAINT "roster_history_schedule_audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "public"."roster_history_schedule_arrangement_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "roster_history_schedule_id" INTEGER,
    "post_id" INTEGER,
    "worker_id" INTEGER,

    CONSTRAINT "roster_history_schedule_arrangement_audit_pkey" PRIMARY KEY ("audit_id")
);

-- Create trigger functions for each table
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

CREATE OR REPLACE FUNCTION organization_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO organization_audit (audit_action, id, name, max_history_count)
        VALUES (TG_OP, OLD.id, OLD.name, OLD.max_history_count);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO organization_audit (audit_action, id, name, max_history_count)
        VALUES (TG_OP, NEW.id, NEW.name, NEW.max_history_count);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION user_organization_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO user_organization_audit (audit_action, id, user_id, organization_id)
        VALUES (TG_OP, OLD.id, OLD.user_id, OLD.organization_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO user_organization_audit (audit_action, id, user_id, organization_id)
        VALUES (TG_OP, NEW.id, NEW.user_id, NEW.organization_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION department_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO department_audit (audit_action, id, organization_id, name)
        VALUES (TG_OP, OLD.id, OLD.organization_id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO department_audit (audit_action, id, organization_id, name)
        VALUES (TG_OP, NEW.id, NEW.organization_id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION post_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_audit (audit_action, id, department_id, name, is_deleted, display_position)
        VALUES (TG_OP, OLD.id, OLD.department_id, OLD.name, OLD.is_deleted, OLD.display_position);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_audit (audit_action, id, department_id, name, is_deleted, display_position)
        VALUES (TG_OP, NEW.id, NEW.department_id, NEW.name, NEW.is_deleted, NEW.display_position);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_audit (audit_action, id, department_id, name, is_deleted)
        VALUES (TG_OP, OLD.id, OLD.department_id, OLD.name, OLD.is_deleted);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_audit (audit_action, id, department_id, name, is_deleted)
        VALUES (TG_OP, NEW.id, NEW.department_id, NEW.name, NEW.is_deleted);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION post_worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_worker_audit (audit_action, id, post_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.post_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_worker_audit (audit_action, id, post_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.post_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION post_constraint_type_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_constraint_type_audit (audit_action, id, name, enum)
        VALUES (TG_OP, OLD.id, OLD.name, OLD.enum);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_constraint_type_audit (audit_action, id, name, enum)
        VALUES (TG_OP, NEW.id, NEW.name, NEW.enum);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION post_constraint_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_constraint_audit (audit_action, id, department_id, post_constraint_type_id, weighting)
        VALUES (TG_OP, OLD.id, OLD.department_id, OLD.post_constraint_type_id, OLD.weighting);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_constraint_audit (audit_action, id, department_id, post_constraint_type_id, weighting)
        VALUES (TG_OP, NEW.id, NEW.department_id, NEW.post_constraint_type_id, NEW.weighting);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION post_constraint_post_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_constraint_post_audit (audit_action, id, post_constraint_id, post_id)
        VALUES (TG_OP, OLD.id, OLD.post_constraint_id, OLD.post_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_constraint_post_audit (audit_action, id, post_constraint_id, post_id)
        VALUES (TG_OP, NEW.id, NEW.post_constraint_id, NEW.post_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION worker_constraint_type_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_constraint_type_audit (audit_action, id, name, enum)
        VALUES (TG_OP, OLD.id, OLD.name, OLD.enum);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_constraint_type_audit (audit_action, id, name, enum)
        VALUES (TG_OP, NEW.id, NEW.name, NEW.enum);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION worker_constraint_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_constraint_audit (audit_action, id, department_id, worker_constraint_type_id, weighting)
        VALUES (TG_OP, OLD.id, OLD.department_id, OLD.worker_constraint_type_id, OLD.weighting);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_constraint_audit (audit_action, id, department_id, worker_constraint_type_id, weighting)
        VALUES (TG_OP, NEW.id, NEW.department_id, NEW.worker_constraint_type_id, NEW.weighting);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION worker_constraint_worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_constraint_worker_audit (audit_action, id, worker_constraint_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.worker_constraint_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_constraint_worker_audit (audit_action, id, worker_constraint_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.worker_constraint_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION roster_history_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_history_audit (audit_action, id, department_id, created_at, created_by_user_id)
        VALUES (TG_OP, OLD.id, OLD.department_id, OLD.created_at, OLD.created_by_user_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_history_audit (audit_action, id, department_id, created_at, created_by_user_id)
        VALUES (TG_OP, NEW.id, NEW.department_id, NEW.created_at, NEW.created_by_user_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION roster_history_schedule_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_history_schedule_audit (audit_action, id, roster_history_id, day)
        VALUES (TG_OP, OLD.id, OLD.roster_history_id, OLD.day);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_history_schedule_audit (audit_action, id, roster_history_id, day)
        VALUES (TG_OP, NEW.id, NEW.roster_history_id, NEW.day);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION roster_history_schedule_arrangement_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_history_schedule_arrangement_audit (audit_action, id, roster_history_schedule_id, post_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.roster_history_schedule_id, OLD.post_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_history_schedule_arrangement_audit (audit_action, id, roster_history_schedule_id, post_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.roster_history_schedule_id, NEW.post_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER user_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "user"
    FOR EACH ROW EXECUTE FUNCTION user_audit_trigger();

CREATE TRIGGER organization_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "organization"
    FOR EACH ROW EXECUTE FUNCTION organization_audit_trigger();

CREATE TRIGGER user_organization_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "user_organization"
    FOR EACH ROW EXECUTE FUNCTION user_organization_audit_trigger();

CREATE TRIGGER department_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "department"
    FOR EACH ROW EXECUTE FUNCTION department_audit_trigger();

CREATE TRIGGER post_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post"
    FOR EACH ROW EXECUTE FUNCTION post_audit_trigger();

CREATE TRIGGER worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "worker"
    FOR EACH ROW EXECUTE FUNCTION worker_audit_trigger();

CREATE TRIGGER post_worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post_worker"
    FOR EACH ROW EXECUTE FUNCTION post_worker_audit_trigger();

CREATE TRIGGER post_constraint_type_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post_constraint_type"
    FOR EACH ROW EXECUTE FUNCTION post_constraint_type_audit_trigger();

CREATE TRIGGER post_constraint_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post_constraint"
    FOR EACH ROW EXECUTE FUNCTION post_constraint_audit_trigger();

CREATE TRIGGER post_constraint_post_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post_constraint_post"
    FOR EACH ROW EXECUTE FUNCTION post_constraint_post_audit_trigger();

CREATE TRIGGER worker_constraint_type_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "worker_constraint_type"
    FOR EACH ROW EXECUTE FUNCTION worker_constraint_type_audit_trigger();

CREATE TRIGGER worker_constraint_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "worker_constraint"
    FOR EACH ROW EXECUTE FUNCTION worker_constraint_audit_trigger();

CREATE TRIGGER worker_constraint_worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "worker_constraint_worker"
    FOR EACH ROW EXECUTE FUNCTION worker_constraint_worker_audit_trigger();

CREATE TRIGGER roster_history_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_history"
    FOR EACH ROW EXECUTE FUNCTION roster_history_audit_trigger();

CREATE TRIGGER roster_history_schedule_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_history_schedule"
    FOR EACH ROW EXECUTE FUNCTION roster_history_schedule_audit_trigger();

CREATE TRIGGER roster_history_schedule_arrangement_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "roster_history_schedule_arrangement"
    FOR EACH ROW EXECUTE FUNCTION roster_history_schedule_arrangement_audit_trigger();
