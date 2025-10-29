import DaysField from "./days-field";
import DepartmentIdField from "./department-id-field";
import OrganizationIdField from "./organization-id-field";

export default function BasicFilter() {
  return (
    <div className="flex flex-wrap gap-2">
      <OrganizationIdField />
      <DepartmentIdField />
      <DaysField />
    </div>
  )
}