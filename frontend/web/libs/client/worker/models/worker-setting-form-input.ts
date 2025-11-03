import { z } from "zod";
import { MessageContent } from "@/libs/server/_general/enums/message";

export const workerSettingFormInputSchema = z.object({
  organizationId: z.string().min(1, MessageContent.REQUIRED),
  departmentId: z.string().min(1, MessageContent.REQUIRED),
})

export type WorkerSettingFormInput = z.infer<typeof workerSettingFormInputSchema>