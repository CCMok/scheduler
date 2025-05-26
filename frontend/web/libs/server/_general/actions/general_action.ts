import { ServerResponse } from "@/libs/share/_general/model/server-response";
import { ServerResponseStatus } from "../enums/server-response-status";

export const actionWrapper = async <T>(service: () => Promise<ServerResponse<T>>): Promise<ServerResponse<T>> => {
  try {
    return await service()
  } catch (e) {
    console.error(e)
    return {
      status: ServerResponseStatus.INTERNAL_ERROR,
    }
  }  
}