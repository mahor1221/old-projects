const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    let values = {};
    let userId = null;

    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;

    try {
      const user = await this.model.User.findById(req.params.id).exec();
      if (!user) return this.abort(res, 404, logcode, null, "id");
      if (user.type === "superAdmin") return this.abort(res, 404, logcode, null, "id");
      userId = mongoose.Types.ObjectId(req.params.id);

      let result = await this.model.User.aggregate([
        { $match: { _id: userId } },
        {
          $lookup: {
            from: "favoritesEpisodes",
            let: { userId_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$userId", "$$userId_id"] },
                },
              },
            ],
            as: "favoritesEpisode",
          },
        },
        {
          $lookup: {
            from: "episodes",
            localField: "favoritesEpisode.episodeId",
            foreignField: "_id",
            as: "favoritesEpisode.episodeId",
          },
        },
        {
          $project: {
            "favoritesEpisodes.updatedAt": 0,
            "favoritesEpisodes.createdAt": 0,
            "favoritesEpisodes.__v": 0,
            "favoritesEpisodes.userId": 0,
            "favoritesEpisodes.createdAt": 0,
          },
        },
      ]);
      if (!result[0]) return this.abort(res, 404, logcode);
      const Transform = await this.helper.transform(result[0], this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
