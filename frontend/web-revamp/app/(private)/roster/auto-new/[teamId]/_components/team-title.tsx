import H2 from "@/components/_general/_custom/typography/h2";
import { getTeamById } from "@/libs/team/read/get-team-service";

export default async function TeamTitle({
  id,
}: Readonly<{
  id: number;
}>) {
  const team = await getTeamById(id)
  return (
    <H2>{team?.name}</H2>
  )
}