'use client'

import { Department } from "@/external/prisma-generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { use } from "react";
import { UpdateDepartmentConstraintFormInput, UpdateDepartmentConstraintFormInputKey, updateDepartmentConstraintFormInputSchema } from "./update-department-constraint-form-input";
import { notFound, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField } from "@/external/shadcn/components/ui/form";
import CustomFormItem from "@/components/_general/form/custom-form-item";
import CustomCard from "@/components/_general/card/custom-card";
import FormSubmitButton from "@/components/_general/form/form-submit-button";
import { Save } from "lucide-react";
import NumberInput from "@/components/_general/input/number-input";
import { updateDepartmentConstraintAction } from "@/libs/department/actions/update-department-constraint-action";
import { handleCudResponse } from "@/libs/_general/utils/response-utils";
import { isNil } from "lodash";
import { toast } from "sonner";
import { MessageTitle } from "@/libs/_general/enums/message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";

type Props = {
  departmentPromise: Promise<Department | undefined>;
}

export default function UpdateDepartmentConstraintForm({
  departmentPromise,
}: Readonly<Props>) {
  const department = use(departmentPromise)
  if (!department) notFound();

  const form = useForm({
    resolver: zodResolver(updateDepartmentConstraintFormInputSchema),
    defaultValues: {
      [UpdateDepartmentConstraintFormInputKey.MAX_WORKER_POST_PER_ROSTER]: department.maxWorkerPostPerRoster,
    },
  })

  const router = useRouter();

  const onSubmit = async (input: UpdateDepartmentConstraintFormInput) => {
    const response = await updateDepartmentConstraintAction({
      id: department.id,
      maxWorkerPostPerRoster: input[UpdateDepartmentConstraintFormInputKey.MAX_WORKER_POST_PER_ROSTER] ?? undefined,
    })

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('更新部門條件' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CustomCard
          title="部門條件"
          footer={(
            <FormSubmitButton
              icon={<Save />}
              className='ml-auto'
            >
              儲存
            </FormSubmitButton>
          )}
        >
          <FormField
            control={form.control}
            name={UpdateDepartmentConstraintFormInputKey.MAX_WORKER_POST_PER_ROSTER}
            render={({ field }) => (
              <CustomFormItem
                label='每位人員最多次數'
                description='每位人員在每個值班表中，最多編排的次數。(如沒有設定，預設為2)'
              >
                <FormControl>
                  <NumberInput
                    {...field}
                    min={0}
                  />
                </FormControl>
              </CustomFormItem>
            )}
          />
        </CustomCard>
      </form>
    </Form>
  )
}