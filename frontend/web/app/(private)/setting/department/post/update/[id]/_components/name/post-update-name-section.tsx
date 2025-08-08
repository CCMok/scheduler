'use client' // client component for form context

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import UpdatePostNameForm from "./update-post-name-form";
import { Save } from "lucide-react";
import PostNameField from "./post-name-field";
import FormRootMessage from "@/components/form/form-root-message";
import FormSubmitButton from "@/components/form/form-submit-button";

type Props = {
  postId: number;
  postName: string;
}

export default function PostUpdateNameSection({
  postId,
  postName,
}: Readonly<Props>) {
  return (
    <UpdatePostNameForm postId={postId} postName={postName}>
      <Card>
        <CardHeader>
          <CardTitle>職位名稱</CardTitle>
          <CardDescription>
            這是您的職位在 Scheduler 中的可見名稱。例如: 您組織的職位名稱。
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
      {/* TODO: Dialog */}
    </UpdatePostNameForm>
  )
}