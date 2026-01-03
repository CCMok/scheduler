import { Message } from "./message";
import { ServiceResponse } from "./response";

export const tryCatch = <R, A extends any[]>(
  fn: (...args: A) => Promise<ServiceResponse<R>>,
): (...args: A) => Promise<ServiceResponse<R>> =>
  async (...args) => {
    try {
      return await fn(...args)
    } catch (e) {
      console.error('Fail to execute function')
      console.error(e)
      return {
        isSuccess: false,
        message: Message.SYSTEM_ERROR,
      }
    }
  }