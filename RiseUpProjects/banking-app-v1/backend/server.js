/* eslint-disable no-unused-vars */
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

//app config
const app = express();
const port = 8001;

//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//DB config

const connection_url =
  "mongodb+srv://admin-dipjoy:Dipjoy@080701@cluster0.pjssu.mongodb.net/bankingDB?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//api endpoints
app.get("/", (req, res) => res.status(200).send("hello world"));

app.post("/post/register", (req, res) => {
  console.log(req.body);
});

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));
