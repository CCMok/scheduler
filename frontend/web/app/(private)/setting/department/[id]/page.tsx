import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { notFound, redirect } from "next/navigation";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { Department } from "@/external/prisma-generated";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import UpdateDepartmentNameSection from "./_components/update-name/update-department-name-section";
import IndividualSettingLayout from "@/components/layout/setting/individual-setting-layout";
import PostsSequenceSection from "./_components/posts/sequence/posts-sequence-section";
import PostsSection from "./_components/posts/individual/posts-section";
import WorkersSection from "./_components/workers/workers-section";

const getDepartment = async (id: number): Promise<Department | undefined> => {
  const departments = await fetchData(
    async () => await getDepartmentsService({
      where: { id },
    }),
    path => redirect(path),
    [],
  )

  return departments[0];
}

type Props = ParamProps<{ [Param.ID]: string }>

export default async function DepartmentSettingPage({
  params,
}: Readonly<Props>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const department = await getDepartment(id);
  if (!department) notFound();

  return (
    <IndividualSettingLayout
      title={department.name}
      updateNameSection={<UpdateDepartmentNameSection department={department} />}
      otherSection={<>
        <PostsSection deptId={id} />
        <PostsSequenceSection deptId={id} />
        <WorkersSection deptId={id} />
      </>}
    />
  )
}