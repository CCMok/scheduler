import { ReactNode } from "react"
import { useFormContext } from "../utils/form-utils"
import CustomButton from "../../_custom/button/custom-button";
import { Spinner } from "@/external/shadcn/components/ui/spinner";
import LoadingButton from "../../_custom/button/loading-button";

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
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          className={className}
          icon={icon}
        >
          {children}
        </LoadingButton>
      )}
    </form.Subscribe>
  )
}