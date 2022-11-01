const InitializeController = require("./initializeController.js");
const mongoose = require("mongoose");
module.exports = new (class indexController extends InitializeController {
  async single(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;

    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const aggregateData = [
      { $match: query },
      { $addFields: { section: "$sectionId" } },
      {
        $lookup: {
          from: "sections",
          localField: "section",
          foreignField: "_id",
          as: "section",
        },
      },
      { $unwind: "$section" },
      { $addFields: { project: "$section.projectId" } },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      {
        $lookup: {
          from: "logdescriptions",
          localField: "_id",
          foreignField: "logId",
          as: "logDescriptionIds",
        },
      },
      {
        $project: {
          "logDescriptionIds.description": 0,
          "logDescriptionIds.status": 0,
          "logDescriptionIds.logId": 0,
          "logDescriptionIds.updatedAt": 0,
          "logDescriptionIds.createdAt": 0,
          "logDescriptionIds.__v": 0,
          "section.projectId": 0,
          "section.updatedAt": 0,
          "section.createdAt": 0,
          "section.__v": 0,
          "project.updatedAt": 0,
          "project.createdAt": 0,
          "project.__v": 0,
        },
      },
    ];

    try {
      const result = await this.helper.index(req, "log", query, aggregateData);
      if (!result.docs[0]) return this.abort(res, 404, logcode, null, "id");
      const Transform = await this.helper.transform(result.docs[0], this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
