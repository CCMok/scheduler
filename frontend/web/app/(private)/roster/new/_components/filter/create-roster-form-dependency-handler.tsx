'use client'

import { DefaultValues, UseFieldArrayReturn, useFormContext } from "react-hook-form"
import { CreateRosterFilterFormInput, createRosterFilterFormInputStorageSchema, CreateRosterFilterKey, OffFormInput } from "./create-roster-form-input"
import { useEffect, useRef } from "react"
import { isNil } from "lodash"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { getDepartmentsAction } from "@/libs/server/department/actions/get-departments-action"
import { useRouter } from "next/navigation"
import { useCreateRosterFilterStore } from "./store/create-roster-filter-store-provider"
import { LocalStorageKey } from "@/libs/client/_general/enums/local-storage-key"
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action"
import { compareAsc, isEqual } from "date-fns"

type Props = {
  defaultValues: DefaultValues<CreateRosterFilterFormInput>;
  offFieldArray: UseFieldArrayReturn<CreateRosterFilterFormInput, CreateRosterFilterKey.OFFS, "id">;
}

export default function CreateRosterFormDependencyHandler({
  defaultValues,
  offFieldArray,
}: Readonly<Props>) {
  // subscribe only trigger when changes, not include setValue inside initial render
  const { subscribe, setValue, reset } = useFormContext<CreateRosterFilterFormInput>()

  const setDepartments = useCreateRosterFilterStore(state => state.setDepartments);
  const setWorkers = useCreateRosterFilterStore(state => state.setWorkers);

  const router = useRouter();

  const isInitialRenderRef = useRef<boolean>(true);

  const { replace } = offFieldArray;

  // Inital render
  useEffect(() => {
    (async () => {
      if (!isInitialRenderRef.current) return;
      console.log('initial render')

      const storageItem = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_FILTER_FORM);

      let targetValue: DefaultValues<CreateRosterFilterFormInput> = defaultValues;

      if (storageItem) {
        const jsonParsedStorageValues = JSON.parse(storageItem);
        const schemaParseResult = createRosterFilterFormInputStorageSchema.safeParse(jsonParsedStorageValues);
        if (schemaParseResult.success) {
          const parsedStorageValue = schemaParseResult.data;

          const mappedformInput: DefaultValues<CreateRosterFilterFormInput> = {
            ...parsedStorageValue,
            days: parsedStorageValue.days?.map(day => new Date(day)),
            offs: parsedStorageValue.offs?.map(off => ({
              ...off,
              days: off.days?.map(day => new Date(day)),
            })),
          }

          if (!isNil(mappedformInput[CreateRosterFilterKey.ORGANIZATION_ID])) {
            setValue(CreateRosterFilterKey.ORGANIZATION_ID, mappedformInput[CreateRosterFilterKey.ORGANIZATION_ID]);
          }

          if (!isNil(mappedformInput[CreateRosterFilterKey.DEPARTMENT_ID])) {
            setValue(CreateRosterFilterKey.DEPARTMENT_ID, mappedformInput[CreateRosterFilterKey.DEPARTMENT_ID]);
          }

          if (!isNil(mappedformInput[CreateRosterFilterKey.DAYS])) {
            setValue(CreateRosterFilterKey.DAYS, mappedformInput[CreateRosterFilterKey.DAYS] as Date[]);
          }

          // TODO: bug: cannot show offs value
          if (!isNil(mappedformInput[CreateRosterFilterKey.OFFS])) {
            replace(mappedformInput[CreateRosterFilterKey.OFFS] as OffFormInput[]);
          }
          // reset(mappedformInput, { keepDefaultValues: true });

          targetValue = mappedformInput;
        } else {
          console.error('Invalid localStorage CREATE_ROSTER_FILTER_FORM value', schemaParseResult.error.format())
        }
      }

      if (!isNil(targetValue[CreateRosterFilterKey.ORGANIZATION_ID])) {
        const departments = await fetchData(
          async () => await getDepartmentsAction({
            where: { organizationId: targetValue[CreateRosterFilterKey.ORGANIZATION_ID] },
            orderBys: [{ field: 'name' }],
          }),
          router.push,
          [],
        )
        setDepartments(departments);
      }

      if (!isNil(targetValue[CreateRosterFilterKey.DEPARTMENT_ID])) {
        const workers = await fetchData(
          async () => await getWorkersAction({
            where: { departmentId: targetValue[CreateRosterFilterKey.DEPARTMENT_ID] },
            orderBys: [{ field: 'name' }],
          }),
          router.push,
          [],
        )
        setWorkers(workers);
      }

      isInitialRenderRef.current = false;
    })()
  }, [setDepartments, setWorkers, router, defaultValues, setValue, replace])

  // Entire form subscription
  useEffect(() => {
    const entireSubscription = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        console.log('trigger entire subscription')
        localStorage.setItem(LocalStorageKey.CREATE_ROSTER_FILTER_FORM, JSON.stringify(values));
      }
    })
    return () => entireSubscription()
  }, [subscribe])

  // Dependency trigger
  useEffect(() => {
    const organizationIdSubscription = subscribe({
      name: CreateRosterFilterKey.ORGANIZATION_ID,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        (async () => {
          console.log('trigger organization id subscription')
          const organizationId = values[CreateRosterFilterKey.ORGANIZATION_ID];

          if (isNil(organizationId)) return;

          const departments = await fetchData(
            async () => await getDepartmentsAction({
              where: { organizationId },
              orderBys: [{ field: 'name' }],
            }),
            router.push,
            [],
          )

          setDepartments(departments);
          setValue(CreateRosterFilterKey.DEPARTMENT_ID, departments[0]?.id ?? undefined);
        })()
      }
    })
    return () => organizationIdSubscription()
  }, [subscribe, router, setDepartments, setValue])

  useEffect(() => {
    const departmentIdSubscription = subscribe({
      name: CreateRosterFilterKey.DEPARTMENT_ID,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        (async () => {
          console.log('trigger department id subscription')
          const departmentId = values[CreateRosterFilterKey.DEPARTMENT_ID];

          if (isNil(departmentId)) return

          const workers = await fetchData(
            async () => await getWorkersAction({
              where: { departmentId },
              orderBys: [{ field: 'name' }],
            }),
            router.push,
            [],
          )

          setWorkers(workers);
          setValue(CreateRosterFilterKey.OFFS, []);
        })()
      }
    })
    return () => departmentIdSubscription()
  }, [subscribe, router, setWorkers, setValue])

  useEffect(() => {
    const daysSubscription = subscribe({
      name: CreateRosterFilterKey.DAYS,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        console.log('trigger days subscription')
        const days = values[CreateRosterFilterKey.DAYS]
        const offs = values[CreateRosterFilterKey.OFFS]

        const isDayExist = (offDay: Date) => days.some(day => isEqual(offDay, day));

        const newOffs: OffFormInput[] = offs.map(off => ({
          ...off,
          days: off.days.filter(isDayExist).toSorted(compareAsc)
        }))

        setValue(CreateRosterFilterKey.OFFS, newOffs)
      }
    })
    return () => daysSubscription()
  }, [subscribe, setValue])

  return <></>
}