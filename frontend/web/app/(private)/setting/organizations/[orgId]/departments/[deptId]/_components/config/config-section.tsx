import PostConstraintSection from "./post/post-constraint-section";
import WorkerConstraintSection from "./worker/worker-constraint-section";

type Props = {
  deptId: number;
}

export default function ConfigSection({
  deptId,
}: Readonly<Props>) {
  return (
    <div className="space-y-4">
      <PostConstraintSection deptId={deptId} />
      <WorkerConstraintSection deptId={deptId} />
    </div>
  )
}