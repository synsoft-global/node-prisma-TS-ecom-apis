
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async  (from:string,to:string|string[],subject:string,html?:string,text?:string) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let Account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: Account.user, // generated ethereal user
      pass: Account.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: from?from:'"Ashish G" <ashish.g@synsoftglobal.com>', // sender address
    to: to?to:"ashish.g@synsoftglobal.com", // list of receivers
    subject: subject?subject:"Hello ✔", // Subject line
    text: text, //"Hello world?", // plain text body
    html: html //"<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

