-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "user_audit" RENAME COLUMN "role_id" TO "role";

CREATE OR REPLACE FUNCTION user_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO user_audit (audit_action, id, email, password, name, role, is_email_verified)
        VALUES (TG_OP, OLD.id, OLD.email, OLD.password, OLD.name, OLD.role, OLD.is_email_verified);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO user_audit (audit_action, id, email, password, name, role, is_email_verified)
        VALUES (TG_OP, NEW.id, NEW.email, NEW.password, NEW.name, NEW.role, NEW.is_email_verified);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- AlterTable
ALTER TABLE "worker" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "worker_audit" ADD COLUMN     "status" INTEGER;

CREATE OR REPLACE FUNCTION worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_audit (audit_action, id, team_id, name, status)
        VALUES (TG_OP, OLD.id, OLD.team_id, OLD.name, OLD.status);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_audit (audit_action, id, team_id, name, status)
        VALUES (TG_OP, NEW.id, NEW.team_id, NEW.name, NEW.status);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;