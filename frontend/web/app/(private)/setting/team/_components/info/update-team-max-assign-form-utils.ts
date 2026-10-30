import { z } from "zod";

export const FORM_ID = 'update-team-max-assign-form';

export enum FORM_FIELD {
  MAX_ASSIGN = 'maxWorkerAssignPerRoster',
}

/** Empty string = unlimited (null). Positive integer otherwise. */
export const formSchema = z.object({
  [FORM_FIELD.MAX_ASSIGN]: z
    .string()
    .refine(
      (v) => v.trim() === '' || (/^\d+$/.test(v.trim()) && Number(v.trim()) >= 1),
      { message: '請輸入正整數，或留空表示不設上限' },
    ),
})

export function maxAssignToFormValue(value: number | null | undefined): string {
  return value == null ? '' : String(value)
}

export function formValueToMaxAssign(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed === '') return null
  return Number(trimmed)
}
