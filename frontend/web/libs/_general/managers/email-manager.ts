import 'server-only';
import { Resend } from "resend";
import { ReactNode } from 'react';

const FROM_EMAIL_ADDRESS = `no-reply@${process.env.EMAIL_DOMAIN || 'resend.dev'}`;

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string | string[],
  subject: string,
  react: ReactNode,
): Promise<boolean> => {
  const { data, error } = await resend.emails.send({
    from: `Scheduler <${FROM_EMAIL_ADDRESS}>`,
    to,
    subject,
    react,
  });

  if (error) {
    console.error(`Send email fail. Subject: ${subject}. Error:`, error)
    return false;
  }

  console.log(`Sent email. Subject: ${subject}. Email ID:`, data.id)

  return true;
}