const serverless = require("serverless-http");
//https://bitbucket.org/blog/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework
const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const {Server} = require("socket.io");
const {createClient} = require("redis");
const {createAdapter} = require("@socket.io/redis-adapter");
const redisAdapter = require("socket.io-redis");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const fs = require("fs");
const {scheduleTxTemplate} = require("./scheduleJobs/schedule.txTemplate.js");

const {createJobCategories, createPropCategories, createDefaultJobPipeline} = require("./controllers/job.controller");
const {getAndSetInvestmentJobProfile} = require("./controllers/dashboard.controller");
const {setTeam} = require("./controllers/team.controller");
const {setActivities} = require("./controllers/activity.controller");

const {deleteSubTeamWallet} = require("./controllers/accounting/wallet.controller");

const app = express();

const keys = require("./keys/keys");
const sendEmail = require("./services/sendInviteEmail");
const {defaultCoupons} = require("./controllers/accounting/coupon.controller");
const {updateAddProfile} = require("./controllers/user.controller");
const {updateManyBotConvs, deleteWrongConvs} = require("./controllers/chat.controller");
const {tempUpdateRentalRelation} = require("./controllers/brand.app/rental.relation.controller");
const {webhookSubscription} = require("./controllers/accounting/dwolla.webhook.controller");
const {getDefaultDiscountAndTaxAndCreate} = require("./controllers/accounting/discountOrTax.controller.js");
const {getDefaultServiceAndCreate} = require("./controllers/accounting/financial.offering.controller.js");
const {createDefaultIssuePipeline} = require("./controllers/issue.controller.js");
const twilio = require("./services/twilio");
const sgMailSend = require("./services/sendGridEmail");

var logger = require("morgan");
const requireLogin = require("./middlewares/requireLogin.js");

require("dotenv").config();

const port = process.env.port || 3000;

mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}))
    .use(bodyParser.json({limit: "50mb"}))
    .use(cors({"Access-Control-Allow-Origin": "*"}));
logger.token("body", (req, res) => JSON.stringify(req.body));
app.use(logger("tiny"));

// app.use(requireLogin);

let server;

server = http.Server(app);
const io = new Server(server);

io.on("connection", socket => {
    console.log("connected bc");
    io.emit("FromAPI", response);
});

require("./routes/index.route")(app);

try {
    const pubClient = createClient({
        url: keys.redisUrl,
    });
    const subClient = pubClient.duplicate();
    Promise.allSettled([pubClient.connect(), subClient.connect()])
        .then(() => {
            io.adapter(createAdapter(pubClient, subClient));
        })
        .catch(err => console.log("Redis Serer Connection Failed ! Please check the Url"));
} catch (err) {
    console.log("Redis Serer Connection Failed ! Please check the Url");
}

const response = new Date();
// Emitting a new message. Will be consumed by the client

createJobCategories();
createDefaultJobPipeline();
createDefaultIssuePipeline();
// createPropCategories();
// sendEmail();
// setTeam()
// setActivities()

// deleteSubTeamWallet()

defaultCoupons().then(coupons => {
    console.log("coupons are available");
});
app.set("socketio", io);
// use as var socketio = req.app.get('socketio');

// app.use('/api', function (req, res, next) {
//   console.log('check', req.body,' is the req')
//   res.json({
//     status: 200,
//     data:'check server'
//   })
// })

//scheduleTxTemplate();

server.listen(port, () => {
    console.log("Isomorphic JWT login " + port);
});

app.get("/", (req, res) => {
    res.status(200).send("<h1> 16th Aug 2nd </h1>");
});
// getAndSetInvestmentJobProfile()
// updateAddProfile()
// updateManyBotConvs()
// deleteWrongConvs()
tempUpdateRentalRelation();

// dwolla webhook function
webhookSubscription();

// create default discountAndTax

getDefaultDiscountAndTaxAndCreate();

// create default service

getDefaultServiceAndCreate();

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};
