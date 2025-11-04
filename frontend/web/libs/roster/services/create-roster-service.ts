import 'server-only'
import { CreateRosterRequest, createRosterRequestSchema } from "../models/create-roster-request";
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from "../models/sch-arrange-roster-response";
import { DayBaseArrangement, DayBaseSchedule } from '../models/schedule';
import { DepartmentWithWorkersPosts } from '../../department/models/department-dao';
import { isNil } from 'lodash';
import { Worker } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { ApiHeaderKey, ContentType } from '../../_general/enums/api-header';
import { SCH_API_KEY } from '../../_general/constants/sch-constant';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../access/utils/data-access-utils';
import { MessageContent } from '../../_general/enums/message';

export const createRosterService = tryCatch(async (
  request: CreateRosterRequest,
): Promise<ServiceResponse<DayBaseSchedule[]>> => {
  const parsedRequest = createRosterRequestSchema.parse(request);

  const canAccess = await checkCanAccessDepartment(parsedRequest.departmentId);
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '部門'),
  }

  const responseJson = await sendArrangeRosterRequest(parsedRequest);
  if (!responseJson) return {
    status: ServiceResponseStatus.INTERNAL_ERROR,
  }

  const schResponse = parseSchResponse(responseJson)
  if (!schResponse) return {
    status: ServiceResponseStatus.INTERNAL_ERROR,
  }

  const department = await getDepartmentWorkersPosts(parsedRequest.departmentId);
  if (!department) return {
    status: ServiceResponseStatus.INTERNAL_ERROR,
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

const sendArrangeRosterRequest = async (request: CreateRosterRequest): Promise<any> => {
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

const mapSchedules = async (schResponse: SchArrangeRosterResponse, department: DepartmentWithWorkersPosts): Promise<DayBaseSchedule[] | undefined> => {
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

      const arrangementInDayBaseSchedule: DayBaseArrangement = {
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