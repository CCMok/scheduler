'use client'

import { useFormContext } from "react-hook-form"
import { CreateRosterFilterFormInput, createRosterFilterFormInputStorageSchema, CreateRosterFilterKey, OffFormInput } from "./create-roster-form-input"
import { useCallback, useEffect, useRef } from "react"
import { isNil } from "lodash"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { getDepartmentsAction } from "@/libs/server/department/actions/get-departments-action"
import { useRouter } from "next/navigation"
import { useCreateRosterFilterStore } from "../store/create-roster-filter-store-provider"
import { LocalStorageKey } from "@/libs/client/_general/enums/local-storage-key"
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action"
import { compareAsc, isEqual } from "date-fns"

type Props = {
  defaultValues: Partial<CreateRosterFilterFormInput>;
  onOffsReplace: (value: OffFormInput[]) => void;
}

export default function CreateRosterFormDependencyHandler({
  defaultValues,
  onOffsReplace,
}: Readonly<Props>) {
  // subscribe only trigger when changes, not include setValue inside initial render
  const { subscribe, setValue } = useFormContext<CreateRosterFilterFormInput>()

  const setDepartments = useCreateRosterFilterStore(state => state.setDepartments);
  const setWorkers = useCreateRosterFilterStore(state => state.setWorkers);

  const router = useRouter();

  const isInitialRenderRef = useRef<boolean>(true);

  const fetchDepartments = useCallback(
    async (organizationId: number) => await fetchData(
      async () => await getDepartmentsAction({
        where: { organizationId },
        orderBys: [{ field: 'name' }],
      }),
      router.push,
      [],
    ),
    [router],
  )

  const fetchWorkers = useCallback(
    async (departmentId: number) => await fetchData(
      async () => await getWorkersAction({
        where: { departmentId },
        orderBys: [{ field: 'name' }],
      }),
      router.push,
      [],
    ),
    [router],
  )

  const handleStorage = useCallback((storageItem: string): Partial<CreateRosterFilterFormInput> | undefined => {
    const jsonParsedStorageValues = JSON.parse(storageItem);
    const schemaParseResult = createRosterFilterFormInputStorageSchema.safeParse(jsonParsedStorageValues);

    if (!schemaParseResult.success) {
      console.error('Invalid localStorage CREATE_ROSTER_FILTER_FORM value', schemaParseResult.error.format())
      return undefined;
    }

    const parsedStorageData = schemaParseResult.data;

    const mappedformInput: Partial<CreateRosterFilterFormInput> = {
      ...parsedStorageData,
      days: parsedStorageData.days?.map(day => new Date(day)),
      offs: parsedStorageData.offs?.map(off => ({
        ...off,
        days: off.days.map(day => new Date(day)),
      })),
    }

    if (!isNil(mappedformInput[CreateRosterFilterKey.ORGANIZATION_ID])) {
      setValue(CreateRosterFilterKey.ORGANIZATION_ID, mappedformInput[CreateRosterFilterKey.ORGANIZATION_ID]);
    }

    if (!isNil(mappedformInput[CreateRosterFilterKey.DEPARTMENT_ID])) {
      setValue(CreateRosterFilterKey.DEPARTMENT_ID, mappedformInput[CreateRosterFilterKey.DEPARTMENT_ID]);
    }

    if (!isNil(mappedformInput[CreateRosterFilterKey.DAYS])) {
      setValue(CreateRosterFilterKey.DAYS, mappedformInput[CreateRosterFilterKey.DAYS]);
    }

    if (!isNil(mappedformInput[CreateRosterFilterKey.OFFS])) {
      onOffsReplace(mappedformInput[CreateRosterFilterKey.OFFS]);
    }

    return mappedformInput;
  }, [setValue, onOffsReplace])

  // Inital render
  useEffect(() => {
    (async () => {
      if (!isInitialRenderRef.current) return;

      const storageItem = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_FILTER_FORM);

      let targetValue: Partial<CreateRosterFilterFormInput> = defaultValues;

      if (storageItem) {
        const storageFormInput = handleStorage(storageItem)
        if (storageFormInput) {
          targetValue = storageFormInput;
        }
      }

      if (!isNil(targetValue[CreateRosterFilterKey.ORGANIZATION_ID])) {
        const departments = await fetchDepartments(targetValue[CreateRosterFilterKey.ORGANIZATION_ID])
        setDepartments(departments);

        if (isNil(targetValue[CreateRosterFilterKey.DEPARTMENT_ID])) {
          // department id mandatory
          setValue(CreateRosterFilterKey.DEPARTMENT_ID, departments[0]?.id ?? undefined);
        }
      }

      if (!isNil(targetValue[CreateRosterFilterKey.DEPARTMENT_ID])) {
        const workers = await fetchWorkers(targetValue[CreateRosterFilterKey.DEPARTMENT_ID])
        setWorkers(workers);
      }

      isInitialRenderRef.current = false;
    })()
  }, [defaultValues, setValue, setDepartments, setWorkers, fetchDepartments, fetchWorkers, handleStorage])

  // Entire form subscription
  useEffect(() => {
    const entireSubscription = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        localStorage.setItem(LocalStorageKey.CREATE_ROSTER_FILTER_FORM, JSON.stringify(values));
      },
    })
    return () => entireSubscription()
  }, [subscribe])

  // Dependency trigger
  const onOrganizationIdChange = useCallback(async (values: CreateRosterFilterFormInput) => {
    console.log('Trigger organization id change')

    const organizationId = values[CreateRosterFilterKey.ORGANIZATION_ID];

    if (isNil(organizationId)) return;

    const departments = await fetchDepartments(organizationId)

    setDepartments(departments);
    setValue(CreateRosterFilterKey.DEPARTMENT_ID, departments[0]?.id ?? undefined);
  }, [fetchDepartments, setDepartments, setValue])

  useEffect(() => {
    const organizationIdSubscription = subscribe({
      name: CreateRosterFilterKey.ORGANIZATION_ID,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        onOrganizationIdChange(values)
      },
    })
    return () => organizationIdSubscription()
  }, [subscribe, onOrganizationIdChange])

  const onDepartmentIdChange = useCallback(async (values: CreateRosterFilterFormInput) => {
    console.log('Trigger department id change')

    const departmentId = values[CreateRosterFilterKey.DEPARTMENT_ID];

    if (isNil(departmentId)) return

    const workers = await fetchWorkers(departmentId)

    setWorkers(workers);
    setValue(CreateRosterFilterKey.OFFS, []);
  }, [fetchWorkers, setWorkers, setValue])

  useEffect(() => {
    const departmentIdSubscription = subscribe({
      name: CreateRosterFilterKey.DEPARTMENT_ID,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        onDepartmentIdChange(values)
      },
    })
    return () => departmentIdSubscription()
  }, [subscribe, onDepartmentIdChange])

  const onDaysChange = useCallback((values: CreateRosterFilterFormInput) => {
    console.log('Trigger days change')

    const days = values[CreateRosterFilterKey.DAYS]
    const offs = values[CreateRosterFilterKey.OFFS]

    const isDayExist = (offDay: Date) => days.some(day => isEqual(offDay, day));

    const newOffs: OffFormInput[] = offs.map(off => ({
      ...off,
      days: off.days.filter(isDayExist).toSorted(compareAsc)
    }))

    onOffsReplace(newOffs)
  }, [onOffsReplace])

  useEffect(() => {
    const daysSubscription = subscribe({
      name: CreateRosterFilterKey.DAYS,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        onDaysChange(values)
      },
    })
    return () => daysSubscription()
  }, [subscribe, onDaysChange])

  return <></>
}