import nodemailer from 'nodemailer';

const getAuth = async (testAccount, NODE_ENV, SMTP_USER, SMTP_PASSWORD) => (NODE_ENV === 'development'
  ? {
    user: testAccount.user,
    pass: testAccount.pass,
  }
  : {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  });

const sendMail = async (from, to, subject, html) => {
  const testAccount = await nodemailer.createTestAccount();

  const {
    NODE_ENV,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
  } = process.env;

  const auth = await getAuth(testAccount, NODE_ENV, SMTP_USER, SMTP_PASSWORD);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: +SMTP_PORT,
    secure: +SMTP_PORT === 465,
    auth,
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  if (NODE_ENV === 'development') {
    console.log('Message send: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

export default sendMail;
