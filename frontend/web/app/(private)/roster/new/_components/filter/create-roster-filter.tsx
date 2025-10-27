'use client'

import { DefaultValues, useFieldArray, useForm } from "react-hook-form"
import { CreateRosterFilterFormInput, createRosterFilterFormInputSchema, CreateRosterFilterKey } from "./create-roster-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/external/shadcn/components/ui/form"
import CustomCard from "@/components/_general/card/custom-card"
import OffFilter from "./off/off-filter"
import BasicFilter from "./basic/basic-filter"
import { Organization } from "@/external/prisma-generated"
import { CreateRosterFilterStoreProvider } from "./store/create-roster-filter-store-provider"
import CreateRosterFormDependencyHandler from "./create-roster-form-dependency-handler"
import { useMemo } from "react"

type Props = {
  organizations: Organization[];
}

export default function CreateRosterFilter({
  organizations,
}: Readonly<Props>) {
  const defaultValues: DefaultValues<CreateRosterFilterFormInput> = useMemo(() => ({
    organizationId: organizations[0]?.id,
    departmentId: undefined,
    days: [],
    offs: [],
  }), [organizations])

  const form = useForm<CreateRosterFilterFormInput>({
    resolver: zodResolver(createRosterFilterFormInputSchema),
    defaultValues,
  })

  const offFieldArray = useFieldArray({
    control: form.control,
    name: CreateRosterFilterKey.OFFS,
  })

  const onSubmit = (input: CreateRosterFilterFormInput) => {
  }

  return (
    <CreateRosterFilterStoreProvider initState={{ organizations }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CreateRosterFormDependencyHandler defaultValues={defaultValues} offFieldArray={offFieldArray} />
          <CustomCard>
            <BasicFilter />
            <OffFilter offFieldArray={offFieldArray} />
          </CustomCard>
        </form>
      </Form>
    </CreateRosterFilterStoreProvider>
  )
}