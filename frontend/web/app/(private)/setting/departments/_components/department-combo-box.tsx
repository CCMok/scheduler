'use client'

import ComboBox from "@/components/combobox/combo-box";
import { Department } from "@/external/prisma-generated";
import { Label } from "@/external/shadcn/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { PATH } from "@/libs/share/_general/utils/path";
import { Param } from "@/libs/share/_general/enums/param";

type Props = {
  departments: Department[];
}

export default function DepartmentComboBox({
  departments,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQuery = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(Param.ID, id);
    const paramString = params.toString();
    router.push(`${PATH.setting.departments}?${paramString}`);
  }, [searchParams, router])

  const onValueChange = (value: string) => {
    updateQuery(value);
  }

  const id = searchParams.get(Param.ID) ?? '';

  const options = useMemo(() => {
    return [{ id: '', name: '(未選擇)' }, ...departments]
  }, [departments])

  return (
    <div className='space-y-2'>
      <Label>部門</Label>
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