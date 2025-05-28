'use client'

import { useRosterFilterStore } from "@/components/store/roster-filter/roster-filter-store-provider";
import { useMemo } from "react";
import { getDefaultDepartmentId, getDefaultOrganizationId } from "./roster-filter-form-utils";

export const useRosterFilterForm = () => {
  const { organizations } = useRosterFilterStore(state => state);

  const defaultOrganizationId = useMemo(
    () => getDefaultOrganizationId(organizations),
    [organizations]
  )

  const defaultDepartmentId = useMemo(
    () => getDefaultDepartmentId(organizations, defaultOrganizationId),
    [organizations, defaultOrganizationId]
  )

  return {
    defaultOrganizationId,
    defaultDepartmentId,
  }
}