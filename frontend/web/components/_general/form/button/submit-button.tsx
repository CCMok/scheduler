import { ComponentProps, ReactNode } from "react"
import { useFormContext } from "../utils/form-utils"
import LoadingButton from "../../_custom/button/loading-button";

export default function SubmitButton({
  children,
  className,
  icon,
  formId,
  size,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  formId?: string;
  size?: ComponentProps<typeof LoadingButton>["size"];
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
          size={size}
        >
          {children}
        </LoadingButton>
      )}
    </form.Subscribe>
  )
}
