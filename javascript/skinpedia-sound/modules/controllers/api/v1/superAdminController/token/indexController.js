const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    try {
      let query = { userId: req.user._id };
      let sort = {};
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
      if (req.query.userId) {
        req.checkQuery("userId", "ایدی کاربر وارد شده صحیح نیست").isMongoId();
        if (this.validation(req, res)) return "";
        query = { ...query, userId: mongoose.Types.ObjectId(req.query.userId) };
      }
      let project = {
        userId: 0,
        "user.updatedAt": 0,
        "user.createdAt": 0,
        "user.__v": 0,
        "user.password": 0,
        "user.resetLink": 0,
      };
      sort = { ...sort, _id: -1 };
      const aggregateData = [{ $match: query }, ...lookUp, { $project: project }, { $sort: sort }];
      const result = await this.helper.index(req, "token", query, aggregateData);
      if (!result) return this.abort(res, 500, logcode);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
