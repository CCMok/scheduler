import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { Roster } from "../roster";

export const autoCreateRoster = async (): Promise<ServiceResponse<Roster>> => {
  
  return {
    isSuccess: true,
    data: {
      posts: []
    }
  }
}