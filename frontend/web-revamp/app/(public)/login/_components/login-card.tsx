import CustomButton from "@/components/_general/button/custom-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { FORM_ID } from "./login-form-const";
import LoginForm from "./login-form";

export default function LoginCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>登入</CardTitle>
        <CardDescription>輸入您的登入資訊</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter>
        <CustomButton
          type='submit'
          className='w-full'
          form={FORM_ID}
        >
          登入
        </CustomButton>
      </CardFooter>
    </Card>
  )
}