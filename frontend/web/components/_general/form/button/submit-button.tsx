import { ComponentProps, ReactNode } from "react"
import { useFormContext } from "../utils/form-utils"
import CustomButton from "../../_custom/button/custom-button";

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
  size?: ComponentProps<typeof CustomButton>["size"];
}>) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <CustomButton
          type="submit"
          isLoading={isSubmitting}
          className={className}
          icon={icon}
          form={formId}
          size={size}
        >
          {children}
        </CustomButton>
      )}
    </form.Subscribe>
  )
}
