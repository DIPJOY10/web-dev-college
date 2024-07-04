const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const {startSchedulerEngine} = require("./controllers/scheduler.controller");

require("dotenv").config();

const app = express();

const keys = require("./keys/keys");

const port = process.env.schedulePort * 1 || 7000;

mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});

app.use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(cors({"Access-Control-Allow-Origin": "*"}));

let server;

server = http.Server(app);

server.listen(port, () => {
    console.log("Scheduler Server is running on port " + port);
});

startSchedulerEngine("* * * * *");
