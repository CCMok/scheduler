-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_audit" ADD COLUMN     "is_email_verified" BOOLEAN;

CREATE OR REPLACE FUNCTION user_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO user_audit (audit_action, id, email, password, name, role_id, is_email_verified)
        VALUES (TG_OP, OLD.id, OLD.email, OLD.password, OLD.name, OLD.role_id, OLD.is_email_verified);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO user_audit (audit_action, id, email, password, name, role_id, is_email_verified)
        VALUES (TG_OP, NEW.id, NEW.email, NEW.password, NEW.name, NEW.role_id, NEW.is_email_verified);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;
