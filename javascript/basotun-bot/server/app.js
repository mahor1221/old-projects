require("dotenv").config();
const config = require("./modules/config.js");
const mongodb = process.env.MONGODB_URL;
const token = process.env.TELEGRAM_TOKEN;
const port = process.env.APP_PORT;

const mongoose = require("mongoose");
mongoose.connect(mongodb);

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));

const router = require(`${config.path.router}/api-v1.js`)(io);
app.use(`/${token}`, router);

http.listen(port, () => {
  console.log(`http://localhost:${port}/${token}`);
});
