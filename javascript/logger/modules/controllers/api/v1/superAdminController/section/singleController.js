const InitializeController = require("./initializeController.js");
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
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      {
        $project: {
          "project.sectionId": 0,
          "project.updatedAt": 0,
          "project.createdAt": 0,
          "project.__v": 0,
        },
      },
    ];

    try {
      const result = await this.helper.index(req, "section", query, aggregateData);
      if (!result.docs[0]) return this.abort(res, 404, logcode, null, "id");
      const Transform = await this.helper.transform(result.docs[0], this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
