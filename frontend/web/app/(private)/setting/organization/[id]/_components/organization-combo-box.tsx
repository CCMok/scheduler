'use client'

import ComboBox from "@/components/combobox/combo-box";
import { Organization } from "@/external/prisma-generated";
import { Label } from "@/external/shadcn/components/ui/label";
import { PATH } from "@/libs/share/_general/utils/path";
import { useRouter } from "next/navigation";

type Props = {
  organizations: Organization[];
  currentOrgId: number;
}

export default function OrganizationComboBox({
  organizations,
  currentOrgId,
}: Readonly<Props>) {
  const router = useRouter();

  const onValueChange = (value: string) => {
    router.push(PATH.setting.organizationNew.build(Number(value)))
  }

  return (
    <div className='space-y-2'>
      <Label className='text-base'>組織</Label>
      <ComboBox
        value={currentOrgId.toString()}
        options={organizations}
        getValue={option => option.id.toString()}
        getDisplayName={option => option.name}
        onValueChange={onValueChange}
      />
    </div>
  )
}