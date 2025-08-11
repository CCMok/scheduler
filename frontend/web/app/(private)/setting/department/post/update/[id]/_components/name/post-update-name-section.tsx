'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Save } from "lucide-react";
import PostNameField from "./post-name-field";
import FormRootMessage from "@/components/form/form-root-message";
import FormSubmitButton from "@/components/form/form-submit-button";
import { Form } from "@/external/shadcn/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { UiMessageContent, UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useRouter } from "next/navigation";
import { UpdatePostNameFormInput, updatePostNameFormInputSchema } from "@/libs/client/post/models/update-post-name-form-input";
import { UpdatePostNameRequest } from "@/libs/server/post/models/update-post-name-request";
import { updatePostNameAction } from "@/libs/server/post/actions/update-post-name-action";
import { UiResponse } from "@/libs/share/_general/models/ui-response";
import { useState } from "react";
import WarningDialog from "@/components/dialog/warning-dialog";
import { usePostUpdateStore } from "@/components/store/setting/post/post-update-store-provider";

export default function PostUpdateNameSection() {
  const postId = usePostUpdateStore(state => state.postId)
  const postName = usePostUpdateStore(state => state.postName)

  const form = useForm({
    resolver: zodResolver(updatePostNameFormInputSchema),
    defaultValues: {
      name: postName,
    },
  })

  const router = useRouter();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  const onSubmit = async (input: UpdatePostNameFormInput) => {
    if (input.name === postName) {
      form.setError('name', {
        type: UiMessageTitle.INPUT_ERROR,
        message: UiMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱'),
      })
      return;
    }

    setIsAlertDialogOpen(true)
  }

  const onAlertDialogContinue = async () => {
    const input = form.getValues()

    const uiResponse = await updatePost(input)
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('編輯職位名稱' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh()
  }

  const updatePost = async (input: UpdatePostNameFormInput): Promise<UiResponse> => {
    const request: UpdatePostNameRequest = {
      id: postId,
      name: input.name,
    }

    const response = await updatePostNameAction(request)

    return handleServiceResponse(response, path => router.push(path))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>職位名稱</CardTitle>
            <CardDescription>
              這是您的職位在 Scheduler 中的可見名稱。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostNameField postName={postName} />
          </CardContent>
          <CardFooter className='flex space-x-4'>
            <FormRootMessage />
            <FormSubmitButton
              icon={<Save />}
              className='ml-auto'
            >
              儲存
            </FormSubmitButton>
          </CardFooter>
        </Card>
        <WarningDialog
          isOpen={isAlertDialogOpen}
          setIsOpen={setIsAlertDialogOpen}
          title='確定要儲存嗎?'
          description='儲存後將更改職位名稱，請確認是否繼續。'
          onContinue={onAlertDialogContinue}
        />
      </form>
    </Form>
  )
}