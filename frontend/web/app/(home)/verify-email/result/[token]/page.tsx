import { ParamProps } from "@/libs/_general/props/param-props";
import { Param } from "@/libs/_general/enums/param";

type Props = ParamProps<{
  [Param.TOKEN]: string;
}>

export default async function VerifyEmailResultPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const token = awaitedParams[Param.TOKEN];

}