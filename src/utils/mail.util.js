import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const {
  SMTP_SERVICE,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  FROM_EMAIL,
  FROM_NAME,
} = process.env;

const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: SMTP_SERVICE,
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: [465, 587].includes(+process.env.SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const from = `${FROM_NAME} <${FROM_EMAIL}>`;

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};

export default sendMail;
