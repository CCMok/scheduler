import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<'/verify-email/[token]'>) {
  const { token } = await ctx.params;
  console.log(token);
  // TODO
  return Response.json({ message: 'Testing' });
}