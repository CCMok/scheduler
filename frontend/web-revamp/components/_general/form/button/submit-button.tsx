import { ReactNode } from "react"
import { useFormContext } from "../utils/form-utils"
import LoadingButton from "../../_custom/button/loading-button";

export default function SubmitButton({
  children,
  className,
  icon,
  formId,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  formId?: string;
}>) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          className={className}
          icon={icon}
          form={formId}
        >
          {children}
        </LoadingButton>
      )}
    </form.Subscribe>
  )
}