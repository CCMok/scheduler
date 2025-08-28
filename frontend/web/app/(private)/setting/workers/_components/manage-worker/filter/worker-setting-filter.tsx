import OrganizationIdFormField from "./organization-id-form-field"
import DepartmentIdFormField from "./department-id-form-field"
import WorkerNameField from "./worker-name-field"

export default function WorkerSettingFilter() {
  return (
    <div className='flex flex-wrap space-x-4 space-y-4'>
      <OrganizationIdFormField />
      <DepartmentIdFormField />
      <WorkerNameField />
    </div>
  )
}