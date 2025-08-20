import Header from "@/components/header/header";
import { Param } from "@/libs/share/_general/enums/param";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { PATH } from "@/libs/share/_general/utils/path";
import { notFound } from "next/navigation";

export default async function PostSequencePage({
  params,
}: Readonly<ParamProps<{ [Param.ID]: string }>>) {  
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  return (
    <div className="space-y-4">
      <Header backPath={PATH.setting.department.post.base}>
        <span>職位順序</span>
      </Header>
    </div>
  )
}