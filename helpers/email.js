

import nodemailer from "nodemailer";
import * as env from "dotenv";
env.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});
// checking connection
transporter.verify(function (error) {
  if (error) {
    console.log(error);
  }
});

const sendEmail = async (mailOptions) => {
  await transporter.sendMail(mailOptions);
};

export default { sendEmail };
