const {
    getAuthdata,
    sendMail,
    getUserData,
    uploadEnvelope,
    getEnvelopeStatus,
} = require("../controllers/doc.sign.controller");

module.exports = app => {
    app.post("/api/doc/sign/authdata", getAuthdata);
    app.post("/api/doc/sign/sendmail", sendMail);
    app.post("/api/doc/sign/userdata", getUserData);
    app.post("/api/doc/sign/uploadEnvelope", uploadEnvelope);
    app.post("/api/doc/sign/envelopedata", getEnvelopeStatus);
};
