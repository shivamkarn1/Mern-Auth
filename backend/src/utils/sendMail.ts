import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getToEmail = (to: string) =>
  NODE_ENV === "development" ? "delivered@resend.dev" : to;

const sendMail = async ({ to, subject, text, html }: Params) => {
  try {
    const data = await resend.emails.send({
      from: "ShivamKarn <onboarding@resend.dev>",
      to: getToEmail(to),
      subject,
      html,
    });
    console.log({ data });
    return data;
  } catch (error) {
    console.error("Failed to send email: ", error);
    throw error;
  }
};

export { sendMail };
