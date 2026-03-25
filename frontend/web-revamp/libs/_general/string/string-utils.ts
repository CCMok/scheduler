import { z } from "zod";

export const emptyToUndefinedString = z.preprocess(
  val => val === "" ? undefined : val,
  z.string().optional(),
)