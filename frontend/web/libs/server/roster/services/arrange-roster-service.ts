import 'server-only'
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ArrangeRosterRequest, arrangeRosterRequestSchema } from "../models/arrange/arrange-roster-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from "../models/arrange/sch-arrange-roster-response";
import { Arrangement, DayBaseSchedule } from '../../../share/roster/models/day-base-schedule';
import { DepartmentWorkersPosts } from '../../department/models/department-dao';
import { isNil } from 'lodash';
import { Worker } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { ApiHeaderKey, ContentType } from '../../_general/enums/api-header';
import { SCH_API_KEY } from '../../_general/constants/sch-constant';
import { serviceWrapper } from '../../_general/services/general-service';
import { getAccessibleDepartmentIdsService } from '../../access/services/access-service';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';

export const arrangeRosterService = async (request: ArrangeRosterRequest): Promise<ServiceResponse<DayBaseSchedule[]>> =>
  await serviceWrapper<DayBaseSchedule[]>(async () => {
    const parsedRequest = arrangeRosterRequestSchema.parse(request);

    const checkAccessResponse = await checkAccess(parsedRequest.departmentId);
    if (checkAccessResponse) return checkAccessResponse;

    const department = await getDepartmentWorkersPosts(parsedRequest.departmentId);
    if (!department) return {
      status: ServiceResponseStatus.BAD_REQUEST,
    }

    const isRequestValid = checkRequest(parsedRequest, department);
    if (!isRequestValid) return {
      status: ServiceResponseStatus.BAD_REQUEST,
    }

    const responseJson = await sendArrangeRosterRequest(parsedRequest);
    if (!responseJson) return {
      status: ServiceResponseStatus.INTERNAL_ERROR
    }

    const schResponse = parseSchResponse(responseJson)
    if (!schResponse) return {
      status: ServiceResponseStatus.INTERNAL_ERROR
    }

    const schedules = await mapSchedules(schResponse, department)
    if (!schedules) return {
      status: ServiceResponseStatus.INTERNAL_ERROR
    }

    return {
      status: ServiceResponseStatus.OK,
      data: schedules,
    }
  })

const checkAccess = async (departmentId: number): Promise<ServiceResponse<DayBaseSchedule[]> | undefined> => {
  const accessServiceResponse = await getAccessibleDepartmentIdsService();

  if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

  if (accessServiceResponse.data.canAccessAll || accessServiceResponse.data.ids.includes(departmentId)) return;

  return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '部門'),
  }
}

export const getDepartmentWorkersPosts = async (id: number) => {
  return await prisma.department.findUnique({
    where: { id },
    include: {
      workers: {
        where: { isDeleted: false },
      },
      posts: {
        where: { isDeleted: false },
      },
    },
  })
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
        [ApiHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        [ApiHeaderKey.X_API_KEY]: SCH_API_KEY,
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

    schedule.arrangements.sort((a, b) => a.post.displayPosition - b.post.displayPosition || a.post.name.localeCompare(b.post.name))
  }

  return schedules;
}