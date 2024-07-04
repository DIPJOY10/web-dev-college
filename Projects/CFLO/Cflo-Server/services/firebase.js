var admin = require("firebase-admin");
const fs = require("fs");
const keys = require('../keys/keys');

const serviceAccount = require(keys.serviceAccount);
const databaseURL = keys.databaseURL;
// console.log(cert,serviceAccount,databaseURL);
// const firebaseAdmin = null

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
});
var db = firebaseAdmin.database();
module.exports = {
    firebaseAdmin,
    db
}

