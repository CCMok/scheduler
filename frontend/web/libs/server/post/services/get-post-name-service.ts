import 'server-only'
import { serviceWrapper } from '../../_general/services/general-service'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { GetPostNameRequest, getPostNameRequestSchema } from '../models/get-post-name-request'
import prisma from '../../_general/managers/database-manager'
import { ServiceMessage } from '@/libs/share/_general/enums/service-message'

export const getPostNameService = async (request: GetPostNameRequest): Promise<ServiceResponse<string>> => 
  await serviceWrapper(async () => {
    const parsedRequest = getPostNameRequestSchema.parse(request)

    const post = await prisma.post.findUnique({
      where: { id: parsedRequest.id },
    })

    if (!post) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位')
    }
  
    return { 
      status: ServiceResponseStatus.OK,
      data: post.name,
    }
  })