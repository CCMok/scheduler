import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import DepartmentFilter from "./department-filter";

export default async function ManageDepartmentsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>部門管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DepartmentFilter />
        {/* TODO */}
        {/* 
        <OrganizationTable organizations={organizations} /> */}
      </CardContent>
    </Card>
  )
}