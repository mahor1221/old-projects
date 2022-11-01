const config = require("../../../../../config");
const controller = require(`${config.path.controller}/controller`);

const Category = require(`${config.path.model}/category`);
const { response } = require(`${config.path.helper}/response`);

module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { Category }), (this.helper = { response });
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
