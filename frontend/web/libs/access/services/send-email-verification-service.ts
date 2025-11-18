import 'server-only'
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import prisma from '@/libs/_general/managers/database-manager';
import { MessageContent } from '@/libs/_general/enums/message';
import { SendEmailVerificationRequest, sendEmailVerificationRequestSchema } from '../models/send-email-verification-request';
import { sendVerificationEmail } from '../utils/email-verification-utils';

export const sendEmailVerificationService = tryCatch(async (
  request: SendEmailVerificationRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = sendEmailVerificationRequestSchema.parse(request);

  const user = await getUser(parsedRequest.userId);
  if (!user) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  const emailSent = await sendVerificationEmail(user);
  if (!emailSent) return {
    status: ServiceResponseStatus.INTERNAL_ERROR,
  }
  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const getUser = async (id: number) => (
  await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  })
)