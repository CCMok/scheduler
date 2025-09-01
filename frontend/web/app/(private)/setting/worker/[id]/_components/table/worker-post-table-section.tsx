import CreateWorkerPostButton from "./create/create-worker-post-button";
import WorkerPostTable from "./worker-post-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";

export default function WorkerPostTableSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>職位</CardTitle>
        <CardDescription>
          指派職位
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <CreateWorkerPostButton />
        </div>
        <WorkerPostTable />
      </CardContent>
    </Card>
  )
}