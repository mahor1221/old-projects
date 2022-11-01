const config = require("../../../../../config");
const controller = require(`${config.path.controller}/controller`);

const PlayList = require(`${config.path.model}/playList`);

const { response } = require(`${config.path.helper}/response`);
const { index } = require(`${config.path.helper}/indexAggregate`);
const { transform } = require(`${config.path.helper}/transform`);
const itemTransform = ["._id", ".name", ".userId", ".episode"];
module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { PlayList }), (this.helper = { index, response, transform, itemTransform });
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
