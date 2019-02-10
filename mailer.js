"use strict";
const nodemailer = require("nodemailer");
const { USERNAME, PASSWORD, RECIPIENT, EMAIL_HOST } = process.env;
const mailer = async ({ subject, message }) => {

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: USERNAME,
            pass: PASSWORD
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"SALPhBot" <${USERNAME}>`, // sender address
        to: RECIPIENT, // list of receivers
        subject, // Subject line
        text: message, // plain text body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}


// async..await is not allowed in global scope, must use a wrapper
module.exports = { mailer }