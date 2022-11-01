const InitializeController = require("./initializeController");

module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    let query = {};
    let sort = {};
    sort = { ...sort, _id: -1 };
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
          image: 1,
          title: 1,
          numberOfEpisodes: { $size: "$episodes" },
        },
      },
      { $sort: sort },
    ];

    try {
      const result = await this.helper.index(req, "category", query, aggregateData);
      if (!result) return this.abort(res, 500, logcode);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
