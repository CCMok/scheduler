/*
  Warnings:

  - A unique constraint covering the columns `[team_id,name]` on the table `roster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `roster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roster" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "roster_audit" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "roster_team_id_name_key" ON "roster"("team_id", "name");

-- audit
CREATE OR REPLACE FUNCTION roster_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO roster_audit (audit_action, id, team_id, name)
        VALUES (TG_OP, OLD.id, OLD.team_id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO roster_audit (audit_action, id, team_id, name)
        VALUES (TG_OP, NEW.id, NEW.team_id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;
