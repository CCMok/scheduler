'use client'

import ComboBox from "@/components/combobox/combo-box";
import { Organization } from "@/external/prisma-generated";
import { Label } from "@/external/shadcn/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DepartmentParam } from "./department-param";
import { PATH } from "@/libs/share/_general/utils/path";

type Props = {
  organizations: Organization[];
}

export default function OrganizationComboBox({
  organizations,
}: Readonly<Props>) {  
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQuery = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(DepartmentParam.ORGANIZATION_ID, id);
    const paramString = params.toString();
    router.push(`${PATH.setting.departments}?${paramString}`);
  }, [searchParams, router])

  const onValueChange = (value: string) => {
    updateQuery(value);
  }

  const id = searchParams.get(DepartmentParam.ORGANIZATION_ID) ?? '';

  const options = useMemo(() => {
    return [{ id: '', name: '(未選擇)' }, ...organizations]
  }, [organizations])

  return (
    <div className='space-y-2'>
      <Label>組織</Label>
      <ComboBox
        value={id ?? ''}
        options={options}
        getValue={option => option.id.toString()}
        getDisplayName={option => option.name}
        onValueChange={onValueChange}
      />
    </div>  
  )
}