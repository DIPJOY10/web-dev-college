const redis = require("redis");
// const redisClient = redis.createClient(6379,'ec2-54-70-60-243.us-west-2.compute.amazonaws.com');
const {createClient} = require("redis");
const keys = require("../keys/keys");
let redisClient = {};
let connectionStatus = false;
try {
    redisClient = createClient({
        url: keys.redisUrl,
    });
    redisClient
        .connect()
        .then(() => {
            connectionStatus = true;
            console.log("Redis DB Connected Successfully.");
        })
        .catch(err => {
            redisClient = {};
            connectionStatus = false;
            console.log("Redis Serer Connection Failed ! Please check the Url");
        });
    // Promise.allSettled([redisClient.connect()]).then(() => {});
    // (async () => {
    //     await redisClient.connect();
    // })();
} catch (err) {
    redisClient = {};
    console.log("Redis Serer Connection Failed ! Please check the Url");
}

module.exports = {redisClient, connectionStatus};
