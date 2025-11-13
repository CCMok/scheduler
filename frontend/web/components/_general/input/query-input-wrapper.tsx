'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback } from "react"

type Props = {
  render: (value: string, onValueChange: (value: string) => void) => ReactNode;
  paramName: string;
  cascadeParamNames?: string[];
}

export default function QueryInputWrapper({
  render,
  paramName,
  cascadeParamNames,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateQuery = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, id);
    if (cascadeParamNames) {
      for (const cascadeParamName of cascadeParamNames) {
        params.delete(cascadeParamName);
      }
    }
    const paramString = params.toString();
    router.replace(`${pathname}?${paramString}`);
  }, [searchParams, router, paramName, cascadeParamNames, pathname])

  const onValueChange = (value: string) => {
    updateQuery(value);
  }

  const value = searchParams.get(paramName) ?? '';

  return render(value, onValueChange);
}