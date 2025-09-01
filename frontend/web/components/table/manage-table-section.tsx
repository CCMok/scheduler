import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { ReactNode } from "react";

type Props = {
  title?: string;
  filter?: ReactNode;
  table?: ReactNode;
  controlPanel?: ReactNode;
}

export default function ManageTableSection({
  title,
  filter,
  table,
  controlPanel,
}: Readonly<Props>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filter}
        {controlPanel && (
          <div className="flex justify-end">
            {controlPanel}
          </div>
        )}
        {table}
      </CardContent>
    </Card>
  )
}