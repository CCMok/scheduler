import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/external/shadcn/components/ui/field";
import { Input } from "@/external/shadcn/components/ui/input";

export default function LoginCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>登入</CardTitle>
        <CardDescription>輸入您的登入資訊</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="email">電郵</FieldLabel>
              <Input
                id="email"
                type='email'
                autoComplete='email'
              />
            </Field>
          </FieldSet>
        </FieldGroup>
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  )
}