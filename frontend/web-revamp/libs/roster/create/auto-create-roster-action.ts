'use server'

import { autoCreateRoster } from "./auto-create-roster-service";

export const autoCreateRosterAction = async () =>
  await autoCreateRoster()