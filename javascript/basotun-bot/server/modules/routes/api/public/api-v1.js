const express = require("express");
const config = require("../../../config.js");
const BotController = require(`${config.path.botController}/botController.js`);

module.exports = (io) => {
  let botController = new BotController(io);
  const botRouter = express.Router();
  botRouter.post("/", (req, res) => botController.ctrler(req, res));
  return botRouter;
};
