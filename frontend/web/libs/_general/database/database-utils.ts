import { Prisma } from "@/external/prisma/generated/client";
import { FailResponse } from "../service/response";
import { Message } from "../service/message";

export const handlePersistError = (
  error: unknown,
  handlerMap: Map<string, () => FailResponse>
): FailResponse => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return {
      isSuccess: false,
      message: Message.SYSTEM_ERROR,
    }
  }

  const handler = handlerMap.get(error.code)
  if (!handler) {
    return {
      isSuccess: false,
      message: Message.SYSTEM_ERROR,
    }
  }

  return handler()
}