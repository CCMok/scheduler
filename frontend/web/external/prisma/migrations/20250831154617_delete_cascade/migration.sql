-- DropForeignKey
ALTER TABLE "public"."department" DROP CONSTRAINT "department_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post" DROP CONSTRAINT "post_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_constraint" DROP CONSTRAINT "post_constraint_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_constraint_post" DROP CONSTRAINT "post_constraint_post_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_worker" DROP CONSTRAINT "post_worker_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_worker" DROP CONSTRAINT "post_worker_worker_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."roster_history" DROP CONSTRAINT "roster_history_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."roster_history_schedule_arrangement" DROP CONSTRAINT "roster_history_schedule_arrangement_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."roster_history_schedule_arrangement" DROP CONSTRAINT "roster_history_schedule_arrangement_worker_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_organization" DROP CONSTRAINT "user_organization_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_organization" DROP CONSTRAINT "user_organization_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."worker" DROP CONSTRAINT "worker_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."worker_constraint" DROP CONSTRAINT "worker_constraint_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."worker_constraint_worker" DROP CONSTRAINT "worker_constraint_worker_worker_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."user_organization" ADD CONSTRAINT "user_organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_organization" ADD CONSTRAINT "user_organization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."department" ADD CONSTRAINT "department_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post" ADD CONSTRAINT "post_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."worker" ADD CONSTRAINT "worker_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_worker" ADD CONSTRAINT "post_worker_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_worker" ADD CONSTRAINT "post_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_constraint" ADD CONSTRAINT "post_constraint_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_constraint_post" ADD CONSTRAINT "post_constraint_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."worker_constraint" ADD CONSTRAINT "worker_constraint_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."worker_constraint_worker" ADD CONSTRAINT "worker_constraint_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roster_history" ADD CONSTRAINT "roster_history_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roster_history_schedule_arrangement" ADD CONSTRAINT "roster_history_schedule_arrangement_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roster_history_schedule_arrangement" ADD CONSTRAINT "roster_history_schedule_arrangement_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
