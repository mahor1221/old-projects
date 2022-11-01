const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    let query = {};
    let sort = {};
    if (req.user.type === "user") query = { ...query, userId: mongoose.Types.ObjectId(req.user._id) };
    else {
      if (req.query.userId) {
        req.checkQuery("userId", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.validation(req, res)) return;
        query = { ...query, userId: mongoose.Types.ObjectId(req.query.userId) };
      }
    }
    sort = { ...sort, _id: -1 };
    ///
    const aggregateData = [
      { $match: query },
      {
        $lookup: {
          from: "episodes",
          localField: "episode",
          foreignField: "_id",
          as: "episode",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $project: {
          "episode.updatedAt": 0,
          "episode.createdAt": 0,
          "episode.__v": 0,
          "userId.updatedAt": 0,
          "userId.createdAt": 0,
          "userId.__v": 0,
          "userId.password": 0,
        },
      },
      { $sort: sort },
    ];
    try {
      const result = await this.helper.index(req, "playList", query, aggregateData);
      if (!result) return this.abort(res, 500, logcode);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
