import { Card, CardContent } from "@/external/shadcn/components/ui/card"
import DepartmentIdFormField from "./department-id-form-field"
import OrganizationIdFormField from "./organization-id-form-field"
import DaysFormField from "./days-form-field"

export default function BasicFilter() {
  return (
    <Card>
      <CardContent className='flex flex-wrap space-x-4 space-y-4'>
        <OrganizationIdFormField />
        <DepartmentIdFormField />
        <DaysFormField />
      </CardContent>
    </Card>
  )
}