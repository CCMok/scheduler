-- AlterTable
ALTER TABLE "public"."roster_history" ADD COLUMN     "updated_at" TIMESTAMPTZ(3),
ADD COLUMN     "updated_by_user_id" INTEGER;

-- AlterTable
ALTER TABLE "public"."roster_history_audit" ADD COLUMN     "updated_at" TIMESTAMPTZ(3),
ADD COLUMN     "updated_by_user_id" INTEGER;

-- CreateIndex
CREATE INDEX "roster_history_updated_by_user_id_idx" ON "public"."roster_history"("updated_by_user_id");

-- AddForeignKey
ALTER TABLE "public"."roster_history" ADD CONSTRAINT "roster_history_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
