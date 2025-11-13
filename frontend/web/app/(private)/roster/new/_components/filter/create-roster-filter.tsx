'use client'

import { useFieldArray, useForm } from "react-hook-form"
import { CreateRosterFilterFormInput, createRosterFilterFormInputSchema, CreateRosterFilterKey } from "./form/create-roster-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/external/shadcn/components/ui/form"
import CustomCard from "@/components/_general/card/custom-card"
import OffFilter from "./off/off-filter"
import BasicFilter from "./basic/basic-filter"
import { Organization } from "@/external/prisma-generated"
import CreateRosterFormDependencyHandler from "./form/create-roster-form-dependency-handler"
import { use, useMemo } from "react"
import CreateRosterFilterButtonSection from "./button/create-roster-filter-button-section"
import useCreateRosterFormSubmit from "./form/use-create-roster-form-submit"
import { CreateRosterFilterStoreProvider } from "./store/create-roster-filter-store-provider"

type CreateRosterFilterContentProps = {
  organizations: Organization[];
}

function CreateRosterFilterContent({
  organizations,
}: Readonly<CreateRosterFilterContentProps>) {
  const defaultValues: Partial<CreateRosterFilterFormInput> = useMemo(() => ({
    organizationId: organizations[0]?.id,
    departmentId: undefined,
    days: [],
    offs: [],
  }), [organizations])

  const form = useForm<CreateRosterFilterFormInput>({
    resolver: zodResolver(createRosterFilterFormInputSchema),
    defaultValues,
  })

  const offsFieldArray = useFieldArray({
    control: form.control,
    name: CreateRosterFilterKey.OFFS,
  })

  const { submit } = useCreateRosterFormSubmit()

  const onSubmit = async (input: CreateRosterFilterFormInput) =>
    await submit(input)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CreateRosterFormDependencyHandler
          defaultValues={defaultValues}
          onOffsReplace={offsFieldArray.replace}
        />
        <CustomCard>
          <BasicFilter />
          <OffFilter
            fields={offsFieldArray.fields}
            onAppend={offsFieldArray.append}
            onRemove={offsFieldArray.remove}
          />
          <CreateRosterFilterButtonSection />
        </CustomCard>
      </form>
    </Form>
  )
}

type Props = {
  organizationsPromise: Promise<Organization[]>,
}

export default function CreateRosterFilter({
  organizationsPromise,
}: Readonly<Props>) {
  const organizations = use(organizationsPromise);

  return (
    <CreateRosterFilterStoreProvider initState={{ organizations }}>
      <CreateRosterFilterContent organizations={organizations} />
    </CreateRosterFilterStoreProvider>
  )
}