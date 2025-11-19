-- AlterTable
ALTER TABLE "department" ADD COLUMN     "max_worker_post_per_roster" INTEGER;

-- AlterTable
ALTER TABLE "department_audit" ADD COLUMN     "max_worker_post_per_roster" INTEGER;

-- Update trigger function
CREATE OR REPLACE FUNCTION department_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO department_audit (audit_action, id, organization_id, name, max_worker_post_per_roster)
        VALUES (TG_OP, OLD.id, OLD.organization_id, OLD.name, OLD.max_worker_post_per_roster);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO department_audit (audit_action, id, organization_id, name, max_worker_post_per_roster)
        VALUES (TG_OP, NEW.id, NEW.organization_id, NEW.name, NEW.max_worker_post_per_roster);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;