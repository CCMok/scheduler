'use client'

import { useFormContext } from "react-hook-form"
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "./create-roster-form-input"
import { useEffect } from "react"
import { isNil } from "lodash"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { getDepartmentsAction } from "@/libs/server/department/actions/get-departments-action"
import { useRouter } from "next/navigation"
import { useCreateRosterFilterStore } from "./store/create-roster-filter-store-provider"

export default function CreateRosterFormDependencyHandler() {
  const { subscribe } = useFormContext<CreateRosterFilterFormInput>()

  const setDepartments = useCreateRosterFilterStore(state => state.setDepartments);

  const router = useRouter();

  useEffect(() => {
    const organizationIdSubscription = subscribe({
      name: CreateRosterFilterKey.ORGANIZATION_ID,
      formState: {
        values: true,
        touchedFields: true,
      },
      callback: async ({ values, touchedFields }) => {
// TODO: not trigger when default organization id is set . may be set default value programatically
        const organizationId = values[CreateRosterFilterKey.ORGANIZATION_ID];

        if (isNil(organizationId)) return;

        const departments = await fetchData(
          async () => await getDepartmentsAction({
            where: { organizationId },
            orderBys: [{ field: 'name' }],
          }),
          path => router.push(path),
          [],
        )

        setDepartments(departments);
      },
    })

    return () => organizationIdSubscription()
  }, [subscribe])


  return <></>
}