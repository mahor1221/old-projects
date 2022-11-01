const InitializeController = require("./initializeController.js");
const mongoose = require("mongoose");
module.exports = new (class indexController extends InitializeController {
  async single(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;

    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
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
          "log.updatedAt": 0,
          "log.createdAt": 0,
          "log.__v": 0,
        },
      },
    ];

    try {
      const result = await this.helper.index(req, "logDescription", query, aggregateData);
      if (!result.docs[0]) return this.abort(res, 404, logcode, null, "id");
      const Transform = await this.helper.transform(result.docs[0], this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
