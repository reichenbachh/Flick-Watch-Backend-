const nodemailer = require("nodemailer");
const htmlLetter = require("../utils/passwordLetter");

const nodeMail = async (email, resetUrl) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_LOGIN, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `"FlickWatch" <${process.env.SMTP_LOGIN}>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Password reset", // Subject line
    text:
      "You are recieving this mail because you(or someone else) has requested a password change,click on the link below to reset your password", // plain text body
    html: htmlLetter(resetUrl), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

module.exports = nodeMail;
