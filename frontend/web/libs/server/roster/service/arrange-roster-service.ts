import 'server-only'
import { ServerResponse } from "@/libs/share/_general/model/server-response";
import { ArrangeRosterRequest, arrangeRosterRequestSchema } from "../model/arrange/arrange-roster-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from "../model/arrange/sch-arrange-roster-response";
import { Arrangement, Schedule } from '../model/roster';
import { getDepartmentWorkersPosts } from '../../department/repositories/department-repositories';
import { DepartmentWorkersPosts } from '../../department/models/department-model';
import { isNil } from 'lodash';

export const arrangeRoster = async (request: ArrangeRosterRequest): Promise<ServerResponse<Schedule[]>> => {
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

  const response = await mapSchedules(schResponse, department)
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

export const mapSchedules = async (schResponse: SchArrangeRosterResponse, department: DepartmentWorkersPosts): Promise<Schedule[] | undefined> => {
  const schedules: Schedule[] = []

  let arrangementId = 0;

  for (const dayResponse of schResponse) {
    for (const arrangementResponse of dayResponse.arrangements) {
      const schedule = findOrCreateSchedule(schedules, arrangementResponse.postId, department);
      if (!schedule) {
        return;
      }

      const worker = isNil(arrangementResponse.workerId)
        ? undefined
        : department.workers.find(worker => worker.id === arrangementResponse.workerId);

      if (!isNil(arrangementResponse.workerId) && !worker) {
        console.error('WorkerId not found. workerId=', arrangementResponse.workerId);
        return;
      }

      const arrangement: Arrangement = {
        id: arrangementId++,
        day: dayResponse.day,
        worker,
      }

      schedule.arrangements.push(arrangement);
    }
  }

  return schedules;
}

const findOrCreateSchedule = (
  schedules: Schedule[],
  postId: number,
  department: DepartmentWorkersPosts,
): Schedule | undefined => {
  let schedule = schedules.find(s => s.post.id === postId);
  if (schedule) return schedule;

  const post = department.posts.find(p => p.id === postId);
  if (!post) {
    console.log('Post not found. postId=', postId);
    return;
  }

  schedule = { post, arrangements: [] };
  schedules.push(schedule);
  return schedule;
};