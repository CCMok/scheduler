import { ReactNode } from "react"
import { useFormContext } from "../utils/form-utils"
import CustomButton from "../../button/custom-button";
import { Spinner } from "@/external/shadcn/components/ui/spinner";

export default function SubmitButton({
  children,
  className,
  icon,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
}>) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <CustomButton
          type="submit"
          disabled={isSubmitting}
          className={className}
        >
          {isSubmitting ? <Spinner /> : icon}
          {children}
        </CustomButton>
      )}
    </form.Subscribe>
  )
}