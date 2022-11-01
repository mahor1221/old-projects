const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    try {
      req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
      if (this.validation(req, res)) return "";
      let query = { _id: mongoose.Types.ObjectId(req.params.id) };
      let lookUp = [
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$userId", 0] },
          },
        },
        {
          $addFields: {
            user: { $ifNull: ["$user", null] },
          },
        },
      ];
      let project = {
        userId: 0,
        "user.updatedAt": 0,
        "user.createdAt": 0,
        "user.__v": 0,
        "user.password": 0,
        "user.resetLink": 0,
      };
      const aggregateData = [{ $match: query }, ...lookUp, { $project: project }];
      const aggregate = await this.model.Token.aggregate(aggregateData);
      let result = aggregate[0];
      if (!result) return this.abort(res, 404, logcode, null, "id");
      const Transform = await this.helper.transform(result, this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
