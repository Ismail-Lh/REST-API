import nodemailer, { Transporter } from "nodemailer";

type sendEmailProps = {
  userEmail: string;
  subject: string;
  emailBody: string;
  emailMessage: string;
};

const sendEmail = async ({
  userEmail,
  subject,
  emailBody,
  emailMessage,
}: sendEmailProps) => {
  let transporter: Transporter = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = await transporter.sendMail({
    from: "Ismail Lahbiyeb <ismail@lhbibe.io>",
    to: userEmail,
    subject: subject || "Signup successfully!",
    text: emailMessage,
    html: emailBody,
  });

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
