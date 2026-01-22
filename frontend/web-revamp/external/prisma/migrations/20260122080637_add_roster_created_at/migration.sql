-- AlterTable
ALTER TABLE "roster" ADD COLUMN     "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "roster_audit" ADD COLUMN     "created_at" TIMESTAMPTZ(3);

-- audit
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