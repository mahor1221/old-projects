const config = require("../../../../../config");
const controller = require(`${config.path.controller}/controller`);

const Episode = require(`${config.path.model}/episode`);
const Like = require(`${config.path.model}/statistics/like`);
const DisLike = require(`${config.path.model}/statistics/disLike`);
const Download = require(`${config.path.model}/statistics/download`);
const View = require(`${config.path.model}/statistics/view`);
const FavoritesEpisode = require(`${config.path.model}/favoritesEpisode`);

const { response } = require(`${config.path.helper}/response`);
const { index } = require(`${config.path.helper}/indexAggregate`);
const { transform } = require(`${config.path.helper}/transform`);
const itemTransform = [
  "._id",
  ".title",
  ".description",
  ".image",
  ".link",
  ".likeCount",
  ".viewCount",
  ".downloadCount",
  ".category",
  ".status",
];
module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { Episode, Like, DisLike, FavoritesEpisode }),
      (this.helper = { index, response, transform, itemTransform });
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
