import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import DepartmentFilter from "./department-filter";

type Props = {
  orgId?: number;
}

export default async function ManageDepartmentsSection({
  orgId,
}: Readonly<Props>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>部門管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DepartmentFilter orgId={orgId} />
        {/* TODO */}
        {/* 
        <OrganizationTable organizations={organizations} /> */}
      </CardContent>
    </Card>
  )
}