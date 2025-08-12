-- DropIndex
DROP INDEX "public"."post_department_id_name_key";

-- DropIndex
DROP INDEX "public"."worker_department_id_name_key";

-- Create partial unique indexes for active records only
CREATE UNIQUE INDEX "post_department_name_unique_active" 
ON "public"."post" ("department_id", "name") 
WHERE "is_deleted" = false;

CREATE UNIQUE INDEX "worker_department_name_unique_active" 
ON "public"."worker" ("department_id", "name") 
WHERE "is_deleted" = false;

-- Composite indexes for common queries
CREATE INDEX "post_department_active_idx" ON "public"."post" ("department_id") WHERE "is_deleted" = false;
CREATE INDEX "worker_department_active_idx" ON "public"."worker" ("department_id") WHERE "is_deleted" = false;