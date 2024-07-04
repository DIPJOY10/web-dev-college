const Team = require("../models/team.model");
var { db } = require("./firebase")
// const { getDatabase } = require('firebase-admin/database');
const socketApi = (req, profileIds, socketBody) => {
    // var socketio = req.app.get("socketio");
    // profileIds.map(profileId => {
    //     console.log(path);
    //     socketio.emit(path, socketBody);
    //     console.log(socketBody);
    // });
    // const db = getDatabase();
    const ref = db.ref("chats");
    console.log(socketBody);
    console.log(profileIds);
    profileIds.map(async (profileId) => {
        var path = "profile/" + profileId;
        var obj = {
            content: JSON.stringify(socketBody.payload),
            timestamp: Date.now(),
            uid: profileId
        }
        await db.ref("chats").child(path).set(JSON.stringify(socketBody));
    });
    // console.log(ref);
};

module.exports = socketApi;
