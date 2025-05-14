-- CreateTable
CREATE TABLE "constraint_setting" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "constraint_type" TEXT NOT NULL,
    "weighting" INTEGER NOT NULL,

    CONSTRAINT "constraint_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constraint_setting_post" (
    "id" SERIAL NOT NULL,
    "constraint_setting_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "constraint_setting_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constraint_setting_worker" (
    "id" SERIAL NOT NULL,
    "constraint_setting_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "constraint_setting_worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "constraint_setting_post_constraint_setting_id_idx" ON "constraint_setting_post"("constraint_setting_id");

-- CreateIndex
CREATE INDEX "constraint_setting_post_post_id_idx" ON "constraint_setting_post"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "constraint_setting_post_constraint_setting_id_post_id_key" ON "constraint_setting_post"("constraint_setting_id", "post_id");

-- CreateIndex
CREATE INDEX "constraint_setting_worker_constraint_setting_id_idx" ON "constraint_setting_worker"("constraint_setting_id");

-- CreateIndex
CREATE INDEX "constraint_setting_worker_worker_id_idx" ON "constraint_setting_worker"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "constraint_setting_worker_constraint_setting_id_worker_id_key" ON "constraint_setting_worker"("constraint_setting_id", "worker_id");

-- AddForeignKey
ALTER TABLE "constraint_setting" ADD CONSTRAINT "constraint_setting_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraint_setting_post" ADD CONSTRAINT "constraint_setting_post_constraint_setting_id_fkey" FOREIGN KEY ("constraint_setting_id") REFERENCES "constraint_setting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraint_setting_post" ADD CONSTRAINT "constraint_setting_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraint_setting_worker" ADD CONSTRAINT "constraint_setting_worker_constraint_setting_id_fkey" FOREIGN KEY ("constraint_setting_id") REFERENCES "constraint_setting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraint_setting_worker" ADD CONSTRAINT "constraint_setting_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
