const InitializeController = require("./initializeController.js");
const mongoose = require("mongoose");
module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    let query = {};
    let sort = {};
    sort = { ...sort, _id: -1 };
    if (req.query.s) {
      query = { ...query, $text: { $search: `/${req.query.s}/i` } };
      sort = { ...sort, score: { $meta: "textScore" } };
    }
    if (req.query.sectionId) {
      req.checkQuery("sectionId", cfg.msg.wrongSectionId).isMongoId();
      if (this.validation(req, res)) return;
      query = { ...query, sectionId: mongoose.Types.ObjectId(req.query.sectionId) };
    }

    const aggregateData = [
      { $match: query },
      {
        $project: {
          ip: 1,
          data: { $substr: ["$data", 0, 50] },
          logcode: 1,
          sectionId: 1,
        },
      },
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
        $project: {
          "section.projectId": 0,
          "section.updatedAt": 0,
          "section.createdAt": 0,
          "section.__v": 0,
          "project.updatedAt": 0,
          "project.createdAt": 0,
          "project.__v": 0,
        },
      },
      { $sort: sort },
    ];

    try {
      const result = await this.helper.index(req, "log", query, aggregateData);
      if (!result) return this.abort(res, 500, logcode);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
