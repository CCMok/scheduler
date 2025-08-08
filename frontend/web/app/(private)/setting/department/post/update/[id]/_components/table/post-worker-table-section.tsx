import { Worker } from "@/external/prisma-generated"
import CreatePostWorkerButton from "./create-post-worker-button";
import PostWorkerTable from "./post-worker-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";

type Props = {
  workers: Worker[];
}

export default function PostWorkerTableSection({
  workers,
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
          <CreatePostWorkerButton />
        </div>
        <PostWorkerTable workers={workers} />
      </CardContent>
    </Card>
  )
}