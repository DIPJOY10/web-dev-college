const User = require("../models/user.model");
const {firebaseAdmin} = require("../services/firebase");
const {redisClient, connectionStatus} = require("../services/redis");

module.exports = async (req, res, next) => {
    try {
        const firebaseIdToken = req.body.token;
        const {loggedInFirebaseUId} = req.body;
        console.log("Request body in the middle ware is", req.body);

        let decodedToken;
        if (connectionStatus) {
            decodedToken = await redisClient?.get(loggedInFirebaseUId);
        }
        if (!decodedToken) {
            // no-cache
            decodedToken = await firebaseAdmin.auth().verifyIdToken(firebaseIdToken);
            let tokenListLocal = decodedToken.tokenList || [];
            tokenListLocal.push(firebaseIdToken);
            decodedToken = {...decodedToken, tokenList: tokenListLocal};
            redisClient.set(loggedInFirebaseUId, JSON.stringify(decodedToken), {EX: 10000});
        } else {
            //using cache
            decodedToken = JSON.parse(decodedToken);
        }

        let uid = decodedToken.uid;

        User.find({firebaseUid: uid})
            .populate("displayPicture")
            .then(users => {
                req.body.user = users[0];
                next();
            })
            .catch(err => {
                req.body.user = null;
                // TODO : Implement it properly  current shows ERR : Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
                // return res.status(400).send({
                //     message: "User not found.",
                // });
            });
    } catch (err) {
        console.log("Error Occured in middleware function!", err);
        req.body.user = null;
        return res.status(400).send({
            message: "Problem with Authentication token",
        });
    }
};
