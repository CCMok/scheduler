import LoadingButton from '@/components/_general/button/loading-button'
import { useFormContext } from "react-hook-form"
import { ComponentProps } from "react"

export default function FormSubmitButton(props: Readonly<ComponentProps<typeof LoadingButton>>) {
  const { formState: { isSubmitting } } = useFormContext()

  return (
    <LoadingButton
      type='submit'
      isLoading={isSubmitting}
      {...props}
    />
  )
}