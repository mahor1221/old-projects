const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;

    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const aggregateData = [
      { $match: query },
      {
        $lookup: {
          from: "sections",
          localField: "_id",
          foreignField: "projectId",
          as: "sections",
        },
      },
      {
        $project: {
          "sections.projectId": 0,
          "sections.updatedAt": 0,
          "sections.createdAt": 0,
          "sections.__v": 0,
        },
      },
    ];

    try {
      const result = await this.helper.index(req, "project", query, aggregateData);
      if (!result.docs[0]) return this.abort(res, 404, logcode, null, "id");
      const Transform = await this.helper.transform(result.docs[0], this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
