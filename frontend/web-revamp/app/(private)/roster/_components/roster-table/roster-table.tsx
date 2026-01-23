import { Post, Worker } from "@/external/prisma/generated/client";
import { Table } from "@/external/shadcn/components/ui/table";
import { RosterJoin } from "@/libs/roster/roster";
import { convertToRosterDisplayByDao } from "@/libs/roster/roster-utils";

export default function RosterTable({
  roster,
  posts,
  workers,
}: Readonly<{
  roster: RosterJoin;
  posts: Post[];
  workers: Worker[];
}>) {
  const rosterDisplay = convertToRosterDisplayByDao(roster, posts, workers);
  // TODO
  return (
    <Table>

    </Table>
  )
}