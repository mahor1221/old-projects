const InitializeController = require("./initializeController.js");

module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    let query = {};
    let sort = {};
    sort = { ...sort, _id: -1 };
    if (req.query.s) {
      query = { ...query, $text: { $search: `/${req.query.s}/i` } };
      sort = { ...sort, score: { $meta: "textScore" } };
    }

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
      { $sort: sort },
    ];

    try {
      const result = await this.helper.index(req, "project", query, aggregateData);
      if (!result) return this.abort(res, 500, logcode);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
