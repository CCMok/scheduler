'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { workerSettingFormInputSchema } from "@/libs/client/worker/models/worker-setting-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import WorkerSettingFilter from "../worker-setting-filter"
import WorkerSettingFormDependencyHandler from "./worker-setting-form-dependency-handler"
import { getDefaultDepartmentIdInOrganizations, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils"
import { useWorkerSettingFilterStore } from "@/app/(private)/setting/workers/_components/manage-worker/filter/store/worker-setting-filter-store-provider"
import FormRootMessage from "@/components/form/form-root-message"

export default function WorkerSettingForm() {
  const organizations = useWorkerSettingFilterStore(state => state.organizations);

  const form = useForm({
    resolver: zodResolver(workerSettingFormInputSchema),
    defaultValues: {
      organizationId: getDefaultOrganizationId(organizations),
      departmentId: getDefaultDepartmentIdInOrganizations(organizations),
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-4">
        <WorkerSettingFormDependencyHandler />
        <WorkerSettingFilter />
        <FormRootMessage />
      </form>
    </Form>
  )
}