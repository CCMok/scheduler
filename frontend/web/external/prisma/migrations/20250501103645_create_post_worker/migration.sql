-- CreateTable
CREATE TABLE "post_worker" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "post_worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_worker_post_id_worker_id_key" ON "post_worker"("post_id", "worker_id");

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_worker" ADD CONSTRAINT "post_worker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
