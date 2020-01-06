const nodemailer = require('nodemailer');

const sendMail = async function sendMail(mailDest, mailContent, mailSubject) {

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'dev.benjamintollie@gmail.com',
      pass: process.env.MAIL_PASSWD,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Matcha Wizard 👻" <foo@example.com>', // sender address
    to: mailDest, // list of receivers
    subject: mailSubject, // Subject line
    html: mailContent, // html text body
  });

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

module.exports = sendMail;
