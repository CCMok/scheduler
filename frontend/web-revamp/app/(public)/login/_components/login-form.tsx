'use client'

import { FieldGroup, FieldSet } from "@/external/shadcn/components/ui/field";
import { revalidateLogic } from "@tanstack/react-form";
import { FORM_FIELD, FORM_ID, formSchema } from "./login-form-const";
import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { loginAction } from "@/libs/auth/login/login-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PRIVATE_HOME } from "@/libs/_general/path/path";

export default function LoginForm() {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.EMAIL]: '',
      [FORM_FIELD.PASSWORD]: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await loginAction(value)
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('登入成功')
      router.push(PRIVATE_HOME);
    },
  })

  return (
    <form
      id={FORM_ID}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <FieldSet>
          <form.AppField name={FORM_FIELD.EMAIL}>
            {(field) => (
              <field.TextField
                label="電郵"
                placeholder="m@example.com"
                autoComplete="email"
                type='email'
              />
            )}
          </form.AppField>
          <form.AppField name={FORM_FIELD.PASSWORD}>
            {(field) => (
              <field.TextField
                label="密碼"
                autoComplete="current-password"
                type='password'
              />
            )}
          </form.AppField>
        </FieldSet>
      </FieldGroup>
    </form>
  )
}