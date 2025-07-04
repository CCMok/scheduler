import 'server-only'
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ArrangeRosterRequest, arrangeRosterRequestSchema } from "../models/arrange/arrange-roster-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from "../models/arrange/sch-arrange-roster-response";
import { Arrangement, DayBaseSchedule } from '../../../share/roster/models/day-base-schedule';
import { getDepartmentWorkersPosts } from '../../department/repositories/department-repositories';
import { DepartmentWorkersPosts } from '../../department/models/department-model';
import { isNil } from 'lodash';
import { Worker } from '@/external/prisma-generated';
import { schemaCheck } from '../../_general/utils/schema-check-utils';

export const arrangeRoster = async (request: ArrangeRosterRequest): Promise<ServerResponse<DayBaseSchedule[]>> => {
  const isSchemaCheckSuccess = schemaCheck(arrangeRosterRequestSchema, request);
  if (!isSchemaCheckSuccess) return {
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

  const schedules = await mapSchedules(schResponse, department)
  if (!schedules) return {
    status: ServerResponseStatus.INTERNAL_ERROR
  }

  return {
    status: ServerResponseStatus.OK,
    data: schedules,
  }
};

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

const mapSchedules = async (schResponse: SchArrangeRosterResponse, department: DepartmentWorkersPosts): Promise<DayBaseSchedule[] | undefined> => {
  const schedules: DayBaseSchedule[] = [];

  let arrangementId = 0;

  for (const responseSchedule of schResponse) {
    const schedule: DayBaseSchedule = {
      day: responseSchedule.day,
      arrangements: [],
    }

    schedules.push(schedule);

    for (const responseArrangement of responseSchedule.arrangements) {
      const post = department.posts.find(post => post.id === responseArrangement.postId)
      if (!post) {
        console.error('PostId not found. postId=', responseArrangement.postId);
        return;
      }

      let worker: Worker | undefined;
      if (!isNil(responseArrangement.workerId)) {
        worker = department.workers.find(worker => worker.id === responseArrangement.workerId)
        if (!worker) {
          console.error('WorkerId not found. workerId=', responseArrangement.workerId);
          return;
        }
      }

      const arrangementInDayBaseSchedule: Arrangement = {
        id: arrangementId++,
        post,
        worker,
      }

      schedule.arrangements.push(arrangementInDayBaseSchedule)
    }
  }

  return schedules;
}