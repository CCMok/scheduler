import CreatePostWorkerButton from "./create/create-post-worker-button";
import PostWorkerTable from "./post-worker-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";

export default function PostWorkerTableSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>人員</CardTitle>
        <CardDescription>
          指派職位的負責人員
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <CreatePostWorkerButton />
        </div>
        <PostWorkerTable />
      </CardContent>
    </Card>
  )
}