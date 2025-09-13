-- This is an empty migration.
CREATE OR REPLACE FUNCTION role_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO role_audit (audit_action, id, name, enum)
        VALUES (TG_OP, OLD.id, OLD.name, OLD.enum);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO role_audit (audit_action, id, name, enum)
        VALUES (TG_OP, NEW.id, NEW.name, NEW.enum);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;