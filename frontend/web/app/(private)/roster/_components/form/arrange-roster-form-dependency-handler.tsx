'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "../../../../../libs/client/organization/utils/organization-utils";
import { useArrangeRosterFilterStore } from "@/app/(private)/roster/_components/filter/store/arrange-roster-filter-store-provider";
import { useCallback, useEffect, useRef } from "react";
import { DEFAULT_DAYS } from "@/libs/share/roster/constants/roster-constant";
import { OffDay } from "@/libs/client/roster/models/off-day";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action";
import { GetWorkersRequest } from "@/libs/server/worker/models/get-workers-request";

const useHandleOrganizationId = () => {
  const { control, resetField } = useFormContext<ArrangeRosterFormInput>();

  const organizations = useArrangeRosterFilterStore(state => state.organizations);
  const setDepartments = useArrangeRosterFilterStore(state => state.setDepartments);
  const byPassDependencyReset = useArrangeRosterFilterStore(state => state.byPassDependencyReset);

  const organizationId = useWatch({
    control,
    name: 'organizationId',
    defaultValue: getDefaultOrganizationId(organizations),
  })

  const previousOrganizationId = useRef<string>('');

  useEffect(() => {
    const organization = organizations.find(organization => organization.id.toString() === organizationId)
    const departments = organization ? organization.departments : [];

    setDepartments(departments)

    // Only reset if organizationId actually changed
    if (organizationId !== previousOrganizationId.current && !byPassDependencyReset) {
      const defaultDeparmtentId = getDefaultDepartmentIdInDepartments(departments)
      resetField('departmentId', { defaultValue: defaultDeparmtentId })
    }

    previousOrganizationId.current = organizationId;
  }, [organizations, organizationId, setDepartments, resetField, byPassDependencyReset])
}

const useHandleDepartmentId = () => {
  const { control, resetField } = useFormContext<ArrangeRosterFormInput>();

  const departments = useArrangeRosterFilterStore(state => state.departments);
  const setWorkers = useArrangeRosterFilterStore(state => state.setWorkers);
  const byPassDependencyReset = useArrangeRosterFilterStore(state => state.byPassDependencyReset);

  const router = useRouter();

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: getDefaultDepartmentIdInDepartments(departments),
  })

  const onDepartmentIdChange = useCallback(async (departmentId: number) => {
    const request: GetWorkersRequest = {
      where: { departmentId },
      orderBys: [{ field: 'name' }],
    }

    const workers = await fetchData(
      async () => await getWorkersAction(request),
      path => router.push(path),
      [],
    )

    setWorkers(workers)

    // Check bypass before resetting
    if (!byPassDependencyReset) {
      resetField('offs')
    }
  }, [setWorkers, router, resetField, byPassDependencyReset])

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    // Only execute callback if departmentId actually changed
    if (departmentId !== previousDepartmentId.current) {
      onDepartmentIdChange(Number(departmentId));
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, onDepartmentIdChange])
}

const useHandleDays = () => {
  const { control } = useFormContext<ArrangeRosterFormInput>();

  const setOffDays = useArrangeRosterFilterStore(state => state.setOffDays);

  const days = useWatch({
    control,
    name: 'days',
    defaultValue: DEFAULT_DAYS,
  })

  const previousDays = useRef<Date[]>([]);

  useEffect(() => {
    // Check if days actually changed (by comparing ISO strings)
    const currentDaysISO = days.map(d => d.toISOString()).sort();
    const previousDaysISO = previousDays.current.map(d => d.toISOString()).sort();
    const daysChanged = currentDaysISO.length !== previousDaysISO.length || 
      currentDaysISO.some((d, i) => d !== previousDaysISO[i]);

    if (!daysChanged) return;

    const offDays: OffDay[] = days
      .toSorted((a, b) => a.getTime() - b.getTime())
      .map(day => ({
        value: day.toISOString(),
        name: format(day, 'yyyy-MM-dd'),
      }))

    setOffDays(offDays)
    previousDays.current = days;
  }, [days, setOffDays])
}

const useHandleOffDays = () => {
  const { getValues, setValue } = useFormContext<ArrangeRosterFormInput>();

  const offDays = useArrangeRosterFilterStore(state => state.offDays);
  const byPassDependencyReset = useArrangeRosterFilterStore(state => state.byPassDependencyReset);

  const previousOffDays = useRef<OffDay[]>([]);

  useEffect(() => {
    // Check if offDays actually changed
    const offDaysChanged = offDays.length !== previousOffDays.current.length ||
      offDays.some((day, i) => day.value !== previousOffDays.current[i]?.value);

    if (!offDaysChanged || byPassDependencyReset) return;

    const currentOffs = getValues('offs')
    
    currentOffs.forEach((off, index) => {
      const selectedDays = off.days

      const validSelectedDays = selectedDays.filter(selectedDay =>
        offDays.some(offDay => offDay.value === selectedDay)
      )

      if (selectedDays.length !== validSelectedDays.length) {
        setValue(`offs.${index}.days`, validSelectedDays)
      }
    })

    previousOffDays.current = offDays;
  }, [offDays, getValues, setValue, byPassDependencyReset])
}

export default function ArrangeRosterFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  useHandleDays();
  useHandleOffDays();
  return <></>
}