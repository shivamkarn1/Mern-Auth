import resend from "../config/resend";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const sendMail = async ({ to, subject, text, html }: Params) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "delivered@resend.dev",
    subject,
    html,
  });
  if (error) {
    return console.error({ error });
  }
  console.log({ data });
};

export { sendMail };
