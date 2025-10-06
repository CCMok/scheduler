import InputFullWidthContainer from "@/components/_general/input/container/input-full-width-container";
import { Organization } from "@/external/prisma-generated";
import OrganizationIdFormField from "./organization-id-form-field";

type Props = {
  organizations: Organization[];
}

export default function AssignOrganizationFields({
  organizations,
}: Readonly<Props>) {
  return (
    <InputFullWidthContainer>
      <OrganizationIdFormField organizations={organizations} />
    </InputFullWidthContainer>
  )
}