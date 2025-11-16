import { Body, Button, Container, Head, Html, Section, Tailwind, Text } from "@react-email/components";

export const EMAIL_SUBJECT = 'Scheduler - 重置您的密碼';

type Props = {
  userName: string;
  updatePasswordUrl: string;
}

export default function ResetPasswordEmail({
  userName,
  updatePasswordUrl,
}: Readonly<Props>) {
  return (
    <Html>
      <Head>
        <title>Scheudler - Reset password</title>
      </Head>
      <Tailwind>
        <Body className='bg-[#efeef1]'>
          <Container className='bg-white space p-4'>
            <Section>
              <Text>
                您好 {userName}，
              </Text>
              <Text>
                最近有人要求更改您的 Scheduler 帳戶密碼。如果您是請求者，可以在這裡設定新密碼：
              </Text>
              <Button
                href={updatePasswordUrl}
                className='bg-[#000] rounded text-white text-[15px] no-underline text-center w-[210px] py-[14px]'
              >
                重設密碼
              </Button>
              <Text>
                如果您不想更改密碼或沒有提出更改密碼的請求，請忽略並刪除此訊息。
              </Text>
              <Text>
                為了確保您的帳戶安全，請勿將此郵件轉發給任何人。
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

ResetPasswordEmail.PreviewProps = {
  userName: 'Eren Yeager',
  updatePasswordUrl: 'localhost:3000/update-password?token=1234567890',
} as Props;