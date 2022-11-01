const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;

    const categoryId = mongoose.Types.ObjectId(req.params.id);
    let query = { _id: categoryId };
    const aggregateData = [
      { $match: query },
      {
        $lookup: {
          from: "episodes",
          localField: "_id",
          foreignField: "category",
          as: "episodes",
        },
      },
      {
        $project: {
          "episodes.category": 0,
          "episodes.updatedAt": 0,
          "episodes.createdAt": 0,
          "episodes.__v": 0,
        },
      },
    ];

    try {
      const result = await this.helper.index(req, "category", query, aggregateData);
      console.log(result);
      if (!result) return this.abort(res, 500, logcode);
      if (!result.docs || !result.docs[0]) return this.abort(res, 404, logcode);
      const Transform = await this.helper.transform(result.docs[0], this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
