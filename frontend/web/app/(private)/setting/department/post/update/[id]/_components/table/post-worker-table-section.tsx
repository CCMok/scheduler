import { Worker } from "@/external/prisma-generated"
import CreatePostWorkerButton from "./create/create-post-worker-button";
import PostWorkerTable from "./post-worker-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";

type Props = {
  postId: number;
  postName: string;
  workers: Worker[];
  departmentId: number;
}

export default function PostWorkerTableSection({
  postId,
  postName,
  workers,
  departmentId,
}: Readonly<Props>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>職位人員管理</CardTitle>
        <CardDescription>
          指派職位的負責人員
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <CreatePostWorkerButton
            departmentId={departmentId}
            workers={workers}
            postId={postId}
          />
        </div>
        <PostWorkerTable postId={postId} postName={postName} workers={workers} />
      </CardContent>
    </Card>
  )
}