import { Worker } from "@/external/prisma-generated"
import CreatePostWorkerButton from "./create-post-worker-button";
import PostWorkerTable from "./post-worker-table";

type Props = {
  workers: Worker[];
}

export default function PostWorkerTableSection({
  workers,
}: Readonly<Props>) {
  return (
    <div className="space-y-4">
      <h2 className='text-2xl font-semibold'>人員管理</h2>
      <div className="flex justify-end">
        <CreatePostWorkerButton />
      </div>
      <PostWorkerTable workers={workers} />
    </div>
  )
}