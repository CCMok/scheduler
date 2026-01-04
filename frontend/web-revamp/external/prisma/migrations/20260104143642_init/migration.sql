-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "name" TEXT,

    CONSTRAINT "role_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION role_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO role_audit (audit_action, id, name)
        VALUES (TG_OP, OLD.id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO role_audit (audit_action, id, name)
        VALUES (TG_OP, NEW.id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER role_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "role"
    FOR EACH ROW EXECUTE FUNCTION role_audit_trigger();

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "email" TEXT,
    "password" TEXT,
    "name" TEXT,
    "role_id" INTEGER,

    CONSTRAINT "user_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION user_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO user_audit (audit_action, id, email, password, name, role_id)
        VALUES (TG_OP, OLD.id, OLD.email, OLD.password, OLD.name, OLD.role_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO user_audit (audit_action, id, email, password, name, role_id)
        VALUES (TG_OP, NEW.id, NEW.email, NEW.password, NEW.name, NEW.role_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "user"
    FOR EACH ROW EXECUTE FUNCTION user_audit_trigger();

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "owner_id" INTEGER,
    "name" TEXT,

    CONSTRAINT "team_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION team_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO team_audit (audit_action, id, owner_id, name)
        VALUES (TG_OP, OLD.id, OLD.owner_id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO team_audit (audit_action, id, owner_id, name)
        VALUES (TG_OP, NEW.id, NEW.owner_id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "team"
    FOR EACH ROW EXECUTE FUNCTION team_audit_trigger();

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "team_id" INTEGER,
    "name" TEXT,

    CONSTRAINT "post_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION post_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_audit (audit_action, id, team_id, name)
        VALUES (TG_OP, OLD.id, OLD.team_id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_audit (audit_action, id, team_id, name)
        VALUES (TG_OP, NEW.id, NEW.team_id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post"
    FOR EACH ROW EXECUTE FUNCTION post_audit_trigger();

-- CreateTable
CREATE TABLE "worker" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "team_id" INTEGER,
    "name" TEXT,

    CONSTRAINT "worker_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO worker_audit (audit_action, id, team_id, name)
        VALUES (TG_OP, OLD.id, OLD.team_id, OLD.name);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO worker_audit (audit_action, id, team_id, name)
        VALUES (TG_OP, NEW.id, NEW.team_id, NEW.name);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "worker"
    FOR EACH ROW EXECUTE FUNCTION worker_audit_trigger();

-- CreateTable
CREATE TABLE "post_worker" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "post_worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_worker_audit" (
    "audit_id" SERIAL NOT NULL,
    "audit_timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_action" TEXT NOT NULL,
    "id" INTEGER,
    "post_id" INTEGER,
    "worker_id" INTEGER,

    CONSTRAINT "post_worker_audit_pkey" PRIMARY KEY ("audit_id")
);

CREATE OR REPLACE FUNCTION post_worker_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO post_worker_audit (audit_action, id, post_id, worker_id)
        VALUES (TG_OP, OLD.id, OLD.post_id, OLD.worker_id);
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO post_worker_audit (audit_action, id, post_id, worker_id)
        VALUES (TG_OP, NEW.id, NEW.post_id, NEW.worker_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_worker_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "post_worker"
    FOR EACH ROW EXECUTE FUNCTION post_worker_audit_trigger();

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_id_idx" ON "user"("role_id");

-- CreateIndex
CREATE INDEX "team_owner_id_idx" ON "team"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_owner_id_name_key" ON "team"("owner_id", "name");

-- CreateIndex
CREATE INDEX "post_team_id_idx" ON "post"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_team_id_name_key" ON "post"("team_id", "name");

-- CreateIndex
CREATE INDEX "worker_team_id_idx" ON "worker"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "worker_team_id_name_key" ON "worker"("team_id", "name");

-- CreateIndex
CREATE INDEX "post_worker_post_id_idx" ON "post_worker"("post_id");

-- CreateIndex
CREATE INDEX "post_worker_worker_id_idx" ON "post_worker"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_worker_post_id_worker_id_key" ON "post_worker"("post_id", "worker_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
