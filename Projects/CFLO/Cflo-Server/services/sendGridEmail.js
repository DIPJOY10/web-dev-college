const keys = require('../keys/keys');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(keys.SENDGRID_API_KEY)

const sendSGMail = (msg)=>{
    sgMail
        .send(msg)
        .then(() => {
            console.log('mail sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

const sendEmailToGP = ()=>{
    sendSGMail({ 
        to: 'gaurav15parmar@gmail.com',
        from: 'gaurav@contractflo.com',
        subject: 'Test email with Node.js and SendGrid',
        text: 'bhai check',
        html: `<strong>check</strong>`,
    })
}

// sendEmailToGP()