-- AlterTable
ALTER TABLE "post" ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "post_audit" ADD COLUMN     "display_order" INTEGER;

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