import 'server-only'
import { ServerResponse } from "@/libs/share/_general/model/server-response";
import { ArrangeRosterRequest, arrangeRosterRequestSchema } from "../model/arrange-roster-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from "../model/sch-arrange-roster-response";
import { Arrangement, ArrangeRosterResponse, Schedule } from '../model/arrange-roster-response';
import { getDepartmentWorkersPosts } from '../../department/repositories/department-repositories';
import { DepartmentWorkersPosts } from '../../department/models/department-model';

export const arrangeRoster = async (request: ArrangeRosterRequest): Promise<ServerResponse<ArrangeRosterResponse>> => {
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

const mapResponse = async (schResponse: SchArrangeRosterResponse, department: DepartmentWorkersPosts): Promise<ArrangeRosterResponse | undefined> => {
  const response: ArrangeRosterResponse = [];

  for (const day of schResponse) {
    const arrangements: Arrangement[] = [];

    for (const arrangement of day.arrangements) {
      const post = department.posts.find(post => post.id === arrangement.postId)
      if (!post) {
        console.error('Post not found. postId=', arrangement.postId)
        return
      }

      let worker;
      if (arrangement.workerId) {
        worker = department.workers.find(worker => worker.id === arrangement.workerId)
        if (!worker) {
          console.error('Worker not found. workerId=', arrangement.workerId)
          return
        }
      }

      arrangements.push({
        post,
        worker,
      })
    }

    const schedule: Schedule = {
      day: day.day,
      arrangements,
    }

    response.push(schedule);
  }

  return response;
}