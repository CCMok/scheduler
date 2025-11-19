'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import AuthMainSectionBase from "../../_components/auth-main-section-base"
import { verifyEmailTokenAction } from "@/libs/access/actions/verify-email-token-action"
import { useParams, useRouter } from "next/navigation"
import { Param } from "@/libs/_general/enums/param"
import { handleCudResponse } from "@/libs/_general/utils/response-utils"
import { isNil } from "lodash"
import CustomButton from "@/components/_general/button/custom-button"
import Link from "next/link"
import { PATH } from "@/libs/_general/enums/path"
import { afterLoginUi } from "@/libs/access/utils/login-utils"
import { MessageTitle } from "@/libs/_general/enums/message"
import { toast } from "sonner"
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant"

const getDescription = (isLoading: boolean, isVerified: boolean): string => {
  if (isLoading) return '正在驗證電子郵件...'
  if (isVerified) return '您的電子郵件已經成功驗證。'
  return '您的電子郵件驗證失敗。'
}

export default function VerifyEmailResultPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  const firstRenderRef = useRef(true)

  const params = useParams<{ [Param.TOKEN]: string }>()
  const token = params[Param.TOKEN]

  const router = useRouter()

  const loadingCallback = useCallback(async (callback: () => Promise<void>) => {
    await callback()
    setIsLoading(false)
  }, [setIsLoading])

  const verify = useCallback(async () => {
    if (!token) return

    const response = await verifyEmailTokenAction({
      token,
    })

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('驗證電子郵件' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    afterLoginUi()

    setIsVerified(data.isVerified)
  }, [token, router, setIsVerified])

  useEffect(() => {
    if (!firstRenderRef.current) return;
    firstRenderRef.current = true;

    loadingCallback(verify)
  }, [verify, loadingCallback, verify])

  return (
    <AuthMainSectionBase
      title='驗證電子郵件'
      description={getDescription(isLoading, isVerified)}
    >
      {!isLoading && (
        <div className="flex justify-center">
          {isVerified
            ? (
              <CustomButton asChild>
                <Link href={PATH.setting.organizations.new}>
                  前往組織設定
                </Link>
              </CustomButton>
            )
            : (
              <CustomButton asChild>
                <Link href={PATH.login}>
                  返回登入
                </Link>
              </CustomButton>
            )
          }
        </div>
      )}
    </AuthMainSectionBase>
  )
}