'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "../../../../../libs/client/organization/utils/organization-utils";
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";
import { useEffect, useRef } from "react";
import { DEFAULT_DAYS } from "@/libs/share/roster/constants/roster-constant";
import { OffDay } from "@/libs/client/roster/models/off-day";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { PATH } from "@/libs/share/_general/utils/path";

const useHandleOrganizationId = () => {
  const { control, resetField } = useFormContext<ArrangeRosterFormInput>();

  const organizations = useArrangeRosterFilterStore(state => state.organizations);
  const setDepartments = useArrangeRosterFilterStore(state => state.setDepartments);

  const organizationId = useWatch({
    control,
    name: 'organizationId',
    defaultValue: getDefaultOrganizationId(organizations),
  })

  useEffect(() => {
    const organization = organizations.find(organization => organization.id.toString() === organizationId)
    const departments = organization ? organization.departments : [];

    setDepartments(departments)

    const defaultDeparmtentId = getDefaultDepartmentIdInDepartments(departments)
    resetField('departmentId', { defaultValue: defaultDeparmtentId })
  }, [organizations, organizationId, setDepartments, resetField])
}

const useHandleDepartmentId = () => {
  const { control, resetField } = useFormContext<ArrangeRosterFormInput>();

  const departments = useArrangeRosterFilterStore(state => state.departments);

  const router = useRouter();

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: getDefaultDepartmentIdInDepartments(departments),
  })

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    if (departmentId !== previousDepartmentId.current) {
      router.push(PATH.roster.build(departmentId))
      resetField('offs')
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, router, resetField])
}

const useHandleDays = () => {
  const { control } = useFormContext<ArrangeRosterFormInput>();

  const setOffDays = useArrangeRosterFilterStore(state => state.setOffDays);

  const days = useWatch({
    control,
    name: 'days',
    defaultValue: DEFAULT_DAYS,
  })

  useEffect(() => {
    const offDays: OffDay[] = days
      .toSorted((a, b) => a.getTime() - b.getTime())
      .map(day => ({
        value: day.toISOString(),
        name: format(day, 'yyyy-MM-dd'),
      }))

    setOffDays(offDays)
  }, [days, setOffDays])
}

export default function ArrangeRosterFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  useHandleDays();
  return <></>
}