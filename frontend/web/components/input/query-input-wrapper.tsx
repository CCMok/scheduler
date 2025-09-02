'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback } from "react"
import { useDebouncedCallback } from "use-debounce";

type Props = {
  render: (value: string, onValueChange: (value: string) => void) => ReactNode;
  paramName: string;
  cascadeParamNames?: string[];
  path: string;
  debounceMs?: number;
}

export default function QueryInputWrapper({
  render,
  paramName,
  cascadeParamNames,
  path,
  debounceMs,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQuery = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, id);
    cascadeParamNames?.forEach(cascadeParamName => {
      params.delete(cascadeParamName);
    });
    const paramString = params.toString();
    router.push(`${path}?${paramString}`);
  }, [searchParams, router, paramName, cascadeParamNames, path])

  const debounced = useDebouncedCallback(updateQuery, debounceMs);

  const onValueChange = (value: string) => {
    debounced(value);
  }

  const value = searchParams.get(paramName) ?? '';

  return render(value, onValueChange);
}