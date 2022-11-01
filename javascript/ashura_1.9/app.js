const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
global.config = require("./modules/config");

// Connect to DB
mongoose.connect("mongodb+srv://arshia:037arash@cluster0.krxxa.gcp.mongodb.net/nodev1", {   useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false,
useCreateIndex: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(expressValidator());
app.use('/public' , express.static('public'))

const apiRouter = require("./modules/routes/api/api-v1");

app.use("/api", apiRouter);

app.listen(config.port, () => {
    console.log(`Server is running at Port ${config.port}`);
});
