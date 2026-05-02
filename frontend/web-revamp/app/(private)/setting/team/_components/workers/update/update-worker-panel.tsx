import { Worker } from "@/external/prisma/generated/browser";
import UpdateWorkerNameSection from "./name/update-worker-name-section";

export default function UpdateWorkerPanel({
  className,
  worker,
}: Readonly<{
  className?: string;
  worker: Worker;
}>) {
  return (
    <div className={className}>
      <UpdateWorkerNameSection
        worker={worker}
      />
    </div>
  )
}