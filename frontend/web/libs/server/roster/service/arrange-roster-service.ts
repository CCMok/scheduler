import 'server-only'
import { ServerResponse } from "@/libs/share/_general/model/server-response";
import { ArrangeRosterRequest, arrangeRosterRequestSchema } from "../model/arrange-roster-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from "../model/sch-arrange-roster-response";
import { ArrangementNew, ArrangeRosterResponseNew } from '../model/arrange-roster-response';
import { getDepartmentWorkersPosts } from '../../department/repositories/department-repositories';
import { DepartmentWorkersPosts } from '../../department/models/department-model';
import { isNil } from 'lodash';

export const arrangeRoster = async (request: ArrangeRosterRequest): Promise<ServerResponse<ArrangeRosterResponseNew>> => {
  const canParseRequest = parseRequest(request);
  if (!canParseRequest) return {
    status: ServerResponseStatus.BAD_REQUEST,
  }

  const department = await getDepartmentWorkersPosts(request.departmentId);
  if (!department) return {
    status: ServerResponseStatus.BAD_REQUEST,
  }

  const isRequestValid = checkRequest(request, department);
  if (!isRequestValid) return {
    status: ServerResponseStatus.BAD_REQUEST,
  }

  const responseJson = await sendArrangeRosterRequest(request);
  if (!responseJson) return {
    status: ServerResponseStatus.INTERNAL_ERROR
  }

  const schResponse = parseSchResponse(responseJson)
  if (!schResponse) return {
    status: ServerResponseStatus.INTERNAL_ERROR
  }

  const response = await mapResponse(schResponse, department)
  if (!response) return {
    status: ServerResponseStatus.INTERNAL_ERROR
  }

  return {
    status: ServerResponseStatus.OK,
    data: response,
  }
};

const parseRequest = (request: ArrangeRosterRequest): boolean => {
  const result = arrangeRosterRequestSchema.safeParse(request)
  if (!result.success) {
    console.warn('Invalid request', result.error.format())
  }

  return result.success;
}

const checkRequest = (request: ArrangeRosterRequest, department: DepartmentWorkersPosts): boolean => {
  for (const off of request.offs) {
    const isWorkerExist = department.workers.some(worker => worker.id === off.workerId)
    if (!isWorkerExist) {
      console.warn(`WorkerId not found in department. workerId=${off.workerId}, departmentId=${request.departmentId}`)
      return false;
    }
  }

  return true;
}

const sendArrangeRosterRequest = async (request: ArrangeRosterRequest): Promise<any> => {
  try {
    const response = await fetch(`${process.env.SCH_HOST}/roster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error('SCH response error', response.status, await response.text());
      return;
    }

    return await response.json()
  } catch (error) {
    console.error('Fail to send SCH arrange roster request', error);
    return;
  }
}

const parseSchResponse = (responseJson: any): SchArrangeRosterResponse | undefined => {
  const parseResult = schArrangeRosterResponseSchema.safeParse(responseJson)
  if (!parseResult.success) {
    console.error('Invalid response', JSON.stringify(parseResult.error.format()))
    return;
  }

  return parseResult.data;
}

export const mapResponse = async (schResponse: SchArrangeRosterResponse, department: DepartmentWorkersPosts): Promise<ArrangeRosterResponseNew | undefined> => {
  const response: ArrangeRosterResponseNew = { schedules: [] }

  for (const dayResponse of schResponse) {
    for (const arrangementResponse of dayResponse.arrangements) {
      let schedule = response.schedules.find(schedule => schedule.post.id === arrangementResponse.postId)

      if (!schedule) {
        const post = department.posts.find(post => post.id === arrangementResponse.postId);
        if (!post) {
          console.log('Post not found. postId=', arrangementResponse.postId)
          return;
        }
  
        schedule = {
          post,
          arrangements: [],
        };

        response.schedules.push(schedule)
      }

      if (isNil(arrangementResponse.workerId)) {
        const arrangement: ArrangementNew = {
          day: dayResponse.day,
          worker: undefined,
        }
  
        schedule.arrangements.push(arrangement)
        continue;
      }

      const worker = department.workers.find(worker => worker.id === arrangementResponse.workerId);
      if (!worker) {
        console.error('WorkerId not found. workerId=', arrangementResponse.workerId)
        return;
      }

      const arrangement: ArrangementNew = {
        day: dayResponse.day,
        worker,
      }

      schedule.arrangements.push(arrangement)
    }
  }

  return response;
}