import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getToEmail = (to: string) => to;

type SendMailResult = {
  id?: string;
  raw: any;
};

const sendMail = async ({
  to,
  subject,
  text,
  html,
}: Params): Promise<SendMailResult> => {
  try {
    const data = await resend.emails.send({
      from: "ShivamKarn <onboarding@resend.dev>",
      to: getToEmail(to),
      subject,
      html,
      ...(text ? { text } : {}),
    });
    console.log({ data });
    return { id: (data as any)?.id, raw: data };
  } catch (error) {
    console.error("Failed to send email: ", error);
    throw error;
  }
};

export { sendMail };
