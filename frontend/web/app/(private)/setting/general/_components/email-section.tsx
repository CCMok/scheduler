import CustomCard from "@/components/_general/card/custom-card";
import CustomInput from "@/components/_general/input/custom-input";
import { getSession } from "@/libs/access/managers/session-manager";

export default async function EmailSection() {
  const session = await getSession()

  return (
    <CustomCard
      title="電郵地址"
      description="這是您在Scheduler的電郵地址。"
    >
      <CustomInput
        id='email'
        type='email'
        autoComplete='email'
        value={session?.email ?? ''}
        disabled
      />
    </CustomCard>   
  )
}