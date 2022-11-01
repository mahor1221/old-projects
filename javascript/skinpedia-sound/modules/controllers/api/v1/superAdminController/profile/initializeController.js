const config = require("../../../../../config");
const controller = require(`${config.path.controller}/controller`);

const User = require(`${config.path.model}/user`);

const { response } = require(`${config.path.helper}/response`);
const { transform } = require(`${config.path.helper}/transform`);
const { index } = require(`${config.path.helper}/indexAggregate`);
const itemTransform = ["._id", ".firstName", ".lastName", ".email", ".type", ".favoritesEpisode"];

module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { User }), (this.helper = { response, transform, itemTransform, index });
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
