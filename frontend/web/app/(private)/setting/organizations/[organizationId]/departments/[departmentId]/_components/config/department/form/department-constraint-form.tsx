'use client'

import { Department } from "@/external/prisma-generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { use } from "react";
import { DepartmentConstraintFormInput, DepartmentConstraintFormInputKey, departmentConstraintFormInputSchema } from "./department-constraint-form-input";
import { notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField } from "@/external/shadcn/components/ui/form";
import CustomFormItem from "@/components/_general/form/custom-form-item";
import CustomCard from "@/components/_general/card/custom-card";
import FormSubmitButton from "@/components/_general/form/form-submit-button";
import { Save } from "lucide-react";
import NumberInput from "@/components/_general/input/number-input";

type Props = {
  departmentPromise: Promise<Department | undefined>;
}

export default function DepartmentConstraintForm({
  departmentPromise,
}: Readonly<Props>) {
  const department = use(departmentPromise)
  if (!department) notFound();

  const form = useForm({
    resolver: zodResolver(departmentConstraintFormInputSchema),
    defaultValues: {
      [DepartmentConstraintFormInputKey.MAX_WORKER_POST_PER_ROSTER]: department.maxWorkerPostPerRoster,
    },
  })

  const onSubmit = (input: DepartmentConstraintFormInput) => {
    console.log(input)
    // TODO
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
            name={DepartmentConstraintFormInputKey.MAX_WORKER_POST_PER_ROSTER}
            render={({ field }) => (
              <CustomFormItem
                label='每位人員最多次數'
                description='每位人員在每個值班表中，最多編排的次數。'
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