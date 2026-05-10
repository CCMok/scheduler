import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import TextField from "../field/text-field"
import SubmitButton from "../button/submit-button"
import MultipleComboboxField from "../field/multiple-combobox-field"
import SwitchField from "../field/switch-field"

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    MultipleComboboxField,
    SwitchField,
  },
  formComponents: {
    SubmitButton,
  },
})