'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback } from "react"

type Props = {
  render: (value: string, onValueChange: (value: string) => void) => ReactNode;
  paramName: string;
  path: string;
}

export default function QueryInputWrapper({
  render,
  paramName,
  path,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQuery = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, id);
    const paramString = params.toString();
    router.push(`${path}?${paramString}`);
  }, [searchParams, router])

  const onValueChange = (value: string) => {
    updateQuery(value);
  }

  const value = searchParams.get(paramName) ?? '';

  return render(value, onValueChange);
}