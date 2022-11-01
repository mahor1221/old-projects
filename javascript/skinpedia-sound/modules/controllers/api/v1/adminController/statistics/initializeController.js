const config = require("../../../../../config");
const controller = require(`${config.path.controller}/controller`);

const Like = require(`${config.path.model}/statistics/like`);
const DisLike = require(`${config.path.model}/statistics/disLike`);
const Download = require(`${config.path.model}/statistics/download`);
const View = require(`${config.path.model}/statistics/view`);

const { response } = require(`${config.path.helper}/response`);
const { transform } = require(`${config.path.helper}/transform`);
const itemTransform = ["._id", ".name", ".email"];

module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { Like, DisLike, Download, View }), (this.helper = { response, transform, itemTransform });
  }
  validation(req, res) {
    return this.showValidationErrors(req, res);
  }
  ok(res, logcode, message, status = 200) {
    return this.Ok(res, logcode, message, status);
  }
  abort(res, status, logcode, message = null, field = null) {
    return this.Abort(res, status, logcode, message, field);
  }
};
