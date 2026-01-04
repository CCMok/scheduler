import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import TextField from "../field/text-field"
import SubmitButton from "../button/submit-button"

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
})