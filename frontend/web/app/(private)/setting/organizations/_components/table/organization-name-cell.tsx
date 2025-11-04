'use client'

import CustomFormItem from "@/components/_general/form/custom-form-item";
import TickCrossInput from "@/components/_general/input/tick-cross-input";
import InlineEditableControl from "@/components/_general/table/inline-editable-control";
import { Form, FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { UpdateNameFormInput, updateNameFormInputSchema } from "@/libs/_general/models/update-name-form-input";
import { MessageTitle } from "@/libs/_general/enums/message";
import { handleCudResponse } from "@/libs/_general/utils/response-utils";
import { updateOrganizationNameAction } from "@/libs/organization/actions/update-organization-name-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { isNil } from "lodash";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  id: number;
  name: string;
}

export default function OrganizationNameCell({
  id,
  name,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(updateNameFormInputSchema),
    defaultValues: {
      name,
    },
  })

  const router = useRouter();

  const onSubmit = (close: () => void) => async (input: UpdateNameFormInput) => {
    if (name === input.name) {
      close()
      return
    }

    const response = await updateOrganizationNameAction({
      id,
      name: input.name,
    })

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('更改機構名稱' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    close()
    router.refresh()
    form.reset({ name: input.name })
  }

  const onClose = (close: () => void) => () => {
    form.reset()
    close()
  }

  return (
    <InlineEditableControl
      value={name}
      renderInput={close => (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit(close))}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <CustomFormItem>
                  <FormControl>
                    <TickCrossInput
                      {...field}
                      onSubmit={form.handleSubmit(onSubmit(close))}
                      onCancel={onClose(close)}
                      isLoading={form.formState.isSubmitting}
                    />
                  </FormControl>
                </CustomFormItem>
              )}
            />
          </form>
        </Form>
      )}
    />
  )
}