-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_department_id_fkey";

-- DropForeignKey
ALTER TABLE "post_constraint" DROP CONSTRAINT "post_constraint_department_id_fkey";

-- DropForeignKey
ALTER TABLE "post_constraint" DROP CONSTRAINT "post_constraint_post_constraint_type_id_fkey";

-- DropForeignKey
ALTER TABLE "post_constraint_post" DROP CONSTRAINT "post_constraint_post_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_worker" DROP CONSTRAINT "post_worker_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_worker" DROP CONSTRAINT "post_worker_worker_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_organization" DROP CONSTRAINT "user_organization_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "user_organization" DROP CONSTRAINT "user_organization_user_id_fkey";

-- DropForeignKey
ALTER TABLE "worker" DROP CONSTRAINT "worker_department_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_constraint" DROP CONSTRAINT "worker_constraint_department_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_constraint" DROP CONSTRAINT "worker_constraint_worker_constraint_type_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_constraint_worker" DROP CONSTRAINT "worker_constraint_worker_worker_id_fkey";

-- CreateTable
CREATE TABLE "roster_history" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" INTEGER NOT NULL,

    CONSTRAINT "roster_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_history_schedule" (
    "id" SERIAL NOT NULL,
    "roster_history_id" INTEGER NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "roster_history_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_history_schedule_arrangement" (
    "id" SERIAL NOT NULL,
    "roster_history_schedule_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "worker_id" INTEGER,

    CONSTRAINT "roster_history_schedule_arrangement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roster_history_department_id_idx" ON "roster_history"("department_id");

-- CreateIndex
CREATE INDEX "roster_history_created_by_user_id_idx" ON "roster_history"("created_by_user_id");

-- CreateIndex
CREATE INDEX "roster_history_schedule_roster_history_id_idx" ON "roster_history_schedule"("roster_history_id");

-- CreateIndex
CREATE INDEX "roster_history_schedule_arrangement_roster_history_schedule_idx" ON "roster_history_schedule_arrangement"("roster_history_schedule_id");

-- CreateIndex
CREATE INDEX "roster_history_schedule_arrangement_post_id_idx" ON "roster_history_schedule_arrangement"("post_id");

-- CreateIndex
CREATE INDEX "roster_history_schedule_arrangement_worker_id_idx" ON "roster_history_schedule_arrangement"("worker_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint" ADD CONSTRAINT "post_constraint_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint" ADD CONSTRAINT "post_constraint_post_constraint_type_id_fkey" FOREIGN KEY ("post_constraint_type_id") REFERENCES "post_constraint_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_constraint_post" ADD CONSTRAINT "post_constraint_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint" ADD CONSTRAINT "worker_constraint_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint" ADD CONSTRAINT "worker_constraint_worker_constraint_type_id_fkey" FOREIGN KEY ("worker_constraint_type_id") REFERENCES "worker_constraint_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_constraint_worker" ADD CONSTRAINT "worker_constraint_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_history" ADD CONSTRAINT "roster_history_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_history" ADD CONSTRAINT "roster_history_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_history_schedule" ADD CONSTRAINT "roster_history_schedule_roster_history_id_fkey" FOREIGN KEY ("roster_history_id") REFERENCES "roster_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_history_schedule_arrangement" ADD CONSTRAINT "roster_history_schedule_arrangement_roster_history_schedul_fkey" FOREIGN KEY ("roster_history_schedule_id") REFERENCES "roster_history_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_history_schedule_arrangement" ADD CONSTRAINT "roster_history_schedule_arrangement_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_history_schedule_arrangement" ADD CONSTRAINT "roster_history_schedule_arrangement_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
