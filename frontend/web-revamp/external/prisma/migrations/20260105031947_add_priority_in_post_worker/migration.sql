-- AlterTable
ALTER TABLE "post_worker" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "post_worker_audit" ADD COLUMN     "priority" INTEGER;

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