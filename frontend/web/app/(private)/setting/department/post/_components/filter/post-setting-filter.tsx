import { Card, CardContent } from "@/external/shadcn/components/ui/card"
import OrganizationIdFormField from "./organization-id-form-field"
import DepartmentIdFormField from "./department-id-form-field"
import PostNameField from "./post-name-field"

export default function PostSettingFilter() {
  return (
    <Card>
      <CardContent className='flex flex-wrap space-x-4 space-y-4'>
        <OrganizationIdFormField />
        <DepartmentIdFormField />
        <PostNameField />
      </CardContent>
    </Card>
  )
}