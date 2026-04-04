import { Body, Button, Container, Head, Html, Section, Tailwind, Text } from "@react-email/components";

export const EMAIL_SUBJECT = 'Scheduler - 驗證您的電郵地址';

type Props = {
  userName: string;
  verifyUrl: string;
}

export default function ResetPasswordVerificationEmail({
  userName,
  verifyUrl,
}: Readonly<Props>) {
  return (
    <Html>
      <Head>
        <title>Scheudler - Verify email</title>
      </Head>
      <Tailwind>
        <Body className='bg-[#efeef1]'>
          <Container className='bg-white space p-4'>
            <Section>
              <Text>
                您好 {userName}，
              </Text>
              <Text>
                最近有人要求更改您的 Scheduler 帳號密碼。如果您是請求者，可以在這裡設定新密碼：
              </Text>
              <Button
                href={verifyUrl}
                className='bg-[#000] rounded text-white text-[15px] no-underline text-center w-[210px] py-[14px]'
              >
                驗證電郵地址
              </Button>
              <Text>
                如果您不想更改密碼或沒有提出更改密碼的請求，請忽略並刪除此訊息。
              </Text>
              <Text>
                為了確保您的帳號安全，請勿將此郵件轉發給任何人。
              </Text>
              <Text>
                Happy Scheduling!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ResetPasswordVerificationEmail.PreviewProps = {
  userName: 'Eren Yeager',
  verifyUrl: 'localhost:3000/reset-password/verify-email/1234567890',
} as Props;