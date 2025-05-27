'use client'

import { useRosterFilterStore } from "@/components/store/roster-filter/roster-filter-store-provider";
import { useMemo } from "react";
import { getDefaultDepartmentId, getDefaultOrganizationId } from "./roster-filter-form-utils";

export const useRosterFilterForm = () => {
  const { organizationDepartments } = useRosterFilterStore(state => state);

  const defaultOrganizationId = useMemo(
    () => getDefaultOrganizationId(organizationDepartments),
    [organizationDepartments]
  )

  const defaultDepartmentId = useMemo(
    () => getDefaultDepartmentId(organizationDepartments, defaultOrganizationId),
    [organizationDepartments, defaultOrganizationId]
  )

  return {
    defaultOrganizationId,
    defaultDepartmentId,
  }
}