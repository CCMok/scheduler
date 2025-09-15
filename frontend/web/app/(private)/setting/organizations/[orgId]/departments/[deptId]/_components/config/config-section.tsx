import PostConstraintSection from "./post/post-constraint-section";

type Props = {
  deptId: number;
}

export default function ConfigSection({
  deptId,
}: Readonly<Props>) {
  return (
    <PostConstraintSection deptId={deptId} />
  )
}