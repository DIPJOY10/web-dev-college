const nodemailer = require("nodemailer");
const emailHtml = require("./invite.email");
const keys = require("../keys/keys");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(keys.SENDGRID_API_KEY)

const sendEmail = async ({text, link, linkText, email}) => {
    var EmailHtml = emailHtml(text, link, linkText);
    console.log({text, link, linkText, email});
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: keys.INVITE_EMAIL_USER, // generated ethereal user
            pass: keys.INVITE_EMAIL_PASSWORD, // generated ethereal password
        },
    });

    console.log("after transported working fine");
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"ContractFLo 🏢🚀   "<invites@contractflo.com>', // firstParty address
        to: email, // list of receivers
        subject: "Invitation Received ✔", // Subject line
        text: text, // plain text body
        html: EmailHtml, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Message Sent SucessFully!!!!!!!!!!");
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info;
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};


module.exports = sendEmail;
