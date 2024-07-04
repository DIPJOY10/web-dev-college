const keys = require('../keys/keys');
const accountSid = keys.TWILIO_ACCOUNT_SID;
const authToken = keys.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendSMS = (msg) => {
    client.messages
    .create({
        body: msg,
        from: '+13605940122',
        to: '+918825336198'
    })
    .then(message => console.log(message.sid));
}

module.exports = {
    sendSMS
}