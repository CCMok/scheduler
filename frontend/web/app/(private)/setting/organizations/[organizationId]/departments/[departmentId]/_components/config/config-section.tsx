import PostConstraintSection from "./post/post-constraint-section";
import WorkerConstraintSection from "./worker/worker-constraint-section";

type Props = {
  departmentId: number;
}

export default function ConfigSection({
  departmentId,
}: Readonly<Props>) {
  return (
    <div className="space-y-4">
      <PostConstraintSection departmentId={departmentId} />
      <WorkerConstraintSection departmentId={departmentId} />
    </div>
  )
}