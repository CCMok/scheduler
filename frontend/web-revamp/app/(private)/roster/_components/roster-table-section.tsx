import RosterViewTable from "@/components/roster/table/view/roster-view-table";
import { parseRosterItems, RosterJoin } from "@/libs/roster/roster";
import { Calendar } from "lucide-react";
import { Post, Worker } from "@/external/prisma/generated/client";

export default function RosterTableSection({
  roster,
  posts,
  workers,
}: Readonly<{
  roster?: RosterJoin;
  posts: Post[];
  workers: Worker[];
}>) {
  if (!roster) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <div className='text-center'>
          <p className="text-lg font-medium text-muted-foreground">
            未選擇值班表
          </p>
          <p className="text-sm text-muted-foreground/70">
            請先選擇團隊和值班表以查看詳細資訊
          </p>
        </div>
      </div>
    )
  }

  return (
    <RosterViewTable
      timeslots={roster.timeslots}
      posts={posts}
      workers={workers}
      roster={parseRosterItems(roster)}
    />
  )
}