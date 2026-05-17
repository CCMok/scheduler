-- AlterTable
ALTER TABLE "post" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "post_audit" ADD COLUMN     "status" INTEGER;

CREATE OR REPLACE FUNCTION post_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_audit (audit_action, id, team_id, name, display_order, status)
        VALUES (TG_OP, OLD.id, OLD.team_id, OLD.name, OLD.display_order, OLD.status);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_audit (audit_action, id, team_id, name, display_order, status)
        VALUES (TG_OP, NEW.id, NEW.team_id, NEW.name, NEW.display_order, NEW.status);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;
