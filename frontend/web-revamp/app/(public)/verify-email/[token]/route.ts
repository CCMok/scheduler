import 'server-only'
import prisma from "@/libs/_general/database/database-manager";
import { decrypt } from "@/libs/_general/jwt/jwt-manager";
import { NextRequest } from "next/server";
import { SessionPayload, sessionPayloadSchema } from '@/libs/_general/session/session';
import { User } from '@/external/prisma/generated/client';
import { createSession } from '@/libs/_general/session/session-manager';
// TODO: redirect
export async function GET(_req: NextRequest, ctx: RouteContext<'/verify-email/[token]'>) {
  const { token } = await ctx.params;

  const payload = await decryptToken(token)
  if (!payload) return Response.json({ message: 'Unauthorized' });

  const user = await getUser(payload.userId)
  if (!user) return Response.json({ message: 'User not found' });

  if (user.isEmailVerified) return Response.json({ message: 'Email already verified' });

  const updatedUser = await updateUserVerified(payload.userId)

  await createSession(updatedUser)

  return Response.json({ message: 'Verified' });
}

const decryptToken = async (token: string): Promise<SessionPayload | undefined> => {
  const payload = await decrypt(token)
  if (!payload) return

  const parseResult = sessionPayloadSchema.safeParse(payload)
  if (!parseResult.success) {
    console.error('Invalid session payload')
    console.error(parseResult.error)
    return
  }

  return parseResult.data
}

const getUser = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  })
}

const updateUserVerified = async (id: number): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: { isEmailVerified: true },
  })
}