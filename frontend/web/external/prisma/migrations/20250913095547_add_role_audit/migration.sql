-- CreateTable
CREATE TABLE "public"."role_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "name" TEXT,
    "enum" INTEGER,

    CONSTRAINT "role_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION role_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO user_audit (audit_action, id, name, enum)
        VALUES (TG_OP, OLD.id, OLD.name, OLD.enum);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO user_audit (audit_action, id, name, enum)
        VALUES (TG_OP, NEW.id, NEW.name, NEW.enum);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER role_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "role"
    FOR EACH ROW EXECUTE FUNCTION role_audit_trigger();