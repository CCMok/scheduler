import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ServerResponseStatus } from "../enums/server-response-status";

export const actionWrapper = async <T>(service: () => ServerResponse<T> | Promise<ServerResponse<T>>): Promise<ServerResponse<T>> => {
  try {
    return await service()
  } catch (error) {
    console.error(error)
    return {
      status: ServerResponseStatus.INTERNAL_ERROR,
    }
  }  
}