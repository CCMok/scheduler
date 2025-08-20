import OrganizationIdFormField from "./organization-id-form-field"
import DepartmentIdFormField from "./department-id-form-field"
import PostNameField from "./post-name-field"

export default function PostSettingFilter() {
  return (
    <div className='flex flex-wrap space-x-4 space-y-4'>
      <OrganizationIdFormField />
      <DepartmentIdFormField />
      <PostNameField />
    </div>
  )
}