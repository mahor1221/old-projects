"use strict";
import express, { Router } from "express";
const app = express();
const router = Router();
import body_parser from "body-parser";
const { json, urlencoded } = body_parser;
import bluebird from "bluebird";
global.Promise = bluebird;
import config from "./modules/config.js";
import controller from "./modules/controller.js";

app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/", router);
router.get("/sync", controller.sync.bind(controller));

app.listen(config.port, () => {
    console.log(`Server is running at Port ${config.port}`);
});
