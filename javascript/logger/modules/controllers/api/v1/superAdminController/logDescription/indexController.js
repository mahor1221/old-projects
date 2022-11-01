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
      { $addFields: { log: "$logId" } },
      {
        $lookup: {
          from: "logs",
          localField: "log",
          foreignField: "_id",
          as: "log",
        },
      },
      { $unwind: "$log" },
      {
        $project: {
          description: { $substr: ["$description", 0, 50] },
          status: 1,
          "log._id": 1,
          "log.ip": 1,
          "log.data": { $substr: ["$log.data", 0, 50] },
          "log.logcode": 1,
          "log.sectionId": 1,
        },
      },
      {
        $project: {
          "log.updatedAt": 0,
          "log.createdAt": 0,
          "log.__v": 0,
        },
      },
      { $sort: sort },
    ];

    try {
      const result = await this.helper.index(req, "logDescription", query, aggregateData);
      if (!result) return this.abort(res, 500, logcode);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
