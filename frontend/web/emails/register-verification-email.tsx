import { Body, Button, Container, Head, Html, Section, Tailwind, Text } from "@react-email/components";

export const EMAIL_SUBJECT = 'Scheduler - 驗證您的電郵地址';

type Props = {
  userName: string;
  verifyResultUrl: string;
}

export default function RegisterVerificationEmail({
  userName,
  verifyResultUrl,
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
                感謝您註冊 Scheduler 帳戶。為完成註冊手續，請點擊以下按鈕驗證您的電郵地址：
              </Text>
              <Button
                href={verifyResultUrl}
                className='bg-[#000] rounded text-white text-[15px] no-underline text-center w-[210px] py-[14px]'
              >
                驗證電郵地址
              </Button>
              <Text>
                如果您沒有提出註冊帳戶的請求，請忽略並刪除此訊息。
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

RegisterVerificationEmail.PreviewProps = {
  userName: 'Eren Yeager',
  verifyResultUrl: 'localhost:3000/verify-email/result/1234567890',
} as Props;