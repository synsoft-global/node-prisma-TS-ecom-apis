const nodemailer = require("nodemailer");
import { email } from "../config";
// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async (
  to: string | string[],
  subject: string,
  text?: string,
  html?: string,
  from?: string
) => {
  //It Generate test SMTP service account from ethereal.email
  let Account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: Account.user, // generated ethereal user
      pass: Account.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: email,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
};
