'use client'

import { useEffect, useRef } from "react"
import { CreateRosterFilterKey, CreateRosterFilterFormInput, OffFormInput } from "./create-roster-form-input";
import { useFormContext } from "react-hook-form";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { useRouter } from "next/navigation";
import { getDepartmentsAction } from "@/libs/server/department/actions/get-departments-action";
import { useCreateRosterFilterStore } from "./store/create-roster-filter-store-provider";
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action";
import { isNil } from "lodash";
import { compareAsc, isEqual } from "date-fns";
import { LocalStorageKey } from "@/libs/client/_general/enums/local-storage-key";

export default function CreateRosterFormDependencyHandlerOld() {
  const { watch, getValues, setValue, reset, subscribe, formState: { touchedFields} } = useFormContext<CreateRosterFilterFormInput>();

  const setDepartments = useCreateRosterFilterStore(state => state.setDepartments);
  const setWorkers = useCreateRosterFilterStore(state => state.setWorkers);

  const router = useRouter();

  const watched = watch();
  const organizationId = watch(CreateRosterFilterKey.ORGANIZATION_ID);
  const departmentId = watch(CreateRosterFilterKey.DEPARTMENT_ID);
  const days = watch(CreateRosterFilterKey.DAYS);
  console.log('touchedFields', touchedFields)

  const initLoadRef = useRef<boolean>(true);
  const prevDepartmentIdRef = useRef<number | undefined>(undefined);
  const prevDaysRef = useRef<Date[] | undefined>(undefined);

  useEffect(() => {
    const subscription = subscribe({
      formState: { 
        values: true,
        touchedFields: true,
      },
      callback: ({ values, touchedFields }) => {
        console.log('subscribe: values, touchedFields', values, touchedFields)
      }
    })
    return () => subscription()
  }, [subscribe])
  
// TODO: Fix bug: when org not 1st, refresh cannot see off
  // LocalStorage
  useEffect(() => {
    if (!initLoadRef.current) {
      console.log('set local storage', watched)
      localStorage.setItem(LocalStorageKey.CREATE_ROSTER_FILTER_FORM, JSON.stringify(watched))
      return;
    }

    const stored = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_FILTER_FORM);
    if (stored) {
      const parsedStored = JSON.parse(stored);

      const formInput: CreateRosterFilterFormInput = {
        ...parsedStored,
        days: parsedStored.days.map((day: string) => new Date(day)),
        offs: parsedStored.offs.map((off: { days: string[] }) => ({
          ...off,
          days: off.days.map((day: string) => new Date(day)),
        })),
      }
  
      console.log('get local storage and reset', formInput)
      reset(formInput, { keepDefaultValues: true })
    }
    
    initLoadRef.current = false;
  }, [reset, watched])

  // Organization change
  useEffect(() => {
    (async () => {
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

      if (departments.length) {
        console.log('set department id', departments[0].id)
        setValue(CreateRosterFilterKey.DEPARTMENT_ID, departments[0].id);
      }
    })()
  }, [organizationId, setDepartments, setValue, router])

  // Department change
  // 1st: deptIdRef = undefined, deptId = undefined
  // 2nd: (deptId change by organization ID change) deptIdRef = undefined, deptId = 1
  useEffect(() => {
    (async () => {
      if (isNil(departmentId)) return;

      const workers = await fetchData(
        async () => await getWorkersAction({
          where: { departmentId },
          orderBys: [{ field: 'name' }],
        }),
        path => router.push(path),
        [],
      )

      setWorkers(workers);

      if (prevDepartmentIdRef.current !== undefined && prevDepartmentIdRef.current !== departmentId) {
        console.log('set offs to empty array')
        setValue(CreateRosterFilterKey.OFFS, []);
      }

      prevDepartmentIdRef.current = departmentId;
    })()
  }, [departmentId, setWorkers, setValue, router])

  // Days change
  useEffect(() => {
    if (prevDaysRef.current && prevDaysRef.current.length !== days.length) {
      const offs = getValues(CreateRosterFilterKey.OFFS);

      const isDayExist = (offDay: Date) => days.some(day => isEqual(offDay, day));

      const newOffs: OffFormInput[] = offs.map(off => ({
        ...off,
        days: off.days.filter(isDayExist).toSorted(compareAsc)
      }))

      console.log('set offs', newOffs)
      setValue(CreateRosterFilterKey.OFFS, newOffs)
    }

    prevDaysRef.current = [...days];
  }, [days, getValues, setValue])

  return <></>
}