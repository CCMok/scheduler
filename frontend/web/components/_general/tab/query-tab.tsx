'use client'

import { Tab } from "@/libs/share/_general/models/tab";
import CustomTab from "./custom-tab";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isNil } from "lodash";
import { Param } from "@/libs/share/_general/enums/param";

const getValue = (input: string | null, tabs: Tab[]): string | undefined => {
  if (isNil(input)) return tabs[0]?.value
  if (tabs.some(tab => tab.value === input)) return input;
  return tabs[0]?.value
}

type Props = {
  tabs: Tab[];
  isPushRoute?: boolean;
}

export default function QueryTab({ 
  tabs,
  isPushRoute,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = getValue(searchParams.get(Param.TAB), tabs)

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(); // remove other params when change tab
    params.set(Param.TAB, value);
    const paramString = params.toString();
    if (isPushRoute) {
      router.push(`${pathname}?${paramString}`)
    } else {
      router.replace(`${pathname}?${paramString}`)
    }
  }

  return (
    <CustomTab
      tabs={tabs}
      value={value}
      onValueChange={onValueChange}
    />
  )
}