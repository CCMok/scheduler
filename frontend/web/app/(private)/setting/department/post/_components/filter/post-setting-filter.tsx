import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"
import OrganizationIdFormField from "./organization-id-form-field"
import DepartmentIdFormField from "./department-id-form-field"
import PostNameFormField from "./post-name-form-field"

export default function PostSettingFilter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>篩選職位</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-wrap space-x-4 space-y-4'>
        <OrganizationIdFormField />
        <DepartmentIdFormField />
        <PostNameFormField />
      </CardContent>
    </Card>
  )
}