import { getTeamById } from "@/libs/team/read/get-team-service";

export default async function TeamTitle({
  id,
}: Readonly<{
  id: number;
}>) {
  const team = await getTeamById(id)
  return (
    <h3 className='text-2xl font-semibold tracking-tight'>{team?.name}</h3>
  )
}