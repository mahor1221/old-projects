const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;
    let query = { status: "active", _id: mongoose.Types.ObjectId(req.params.id) };
    let sort = {};
    sort = { ...sort, _id: -1 };
    ///
    const aggregateData = [
      { $match: query },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          "category.updatedAt": 0,
          "category.createdAt": 0,
          "category.__v": 0,
        },
      },
      {
        $lookup: {
          from: "dislikes",
          let: { episodeId_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$episodeId", "$$episodeId_id"] },
              },
            },
          ],
          as: "disLike",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { post_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$episodeId", "$$post_id"] },
              },
            },
          ],
          as: "like",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { post_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$episodeId", "$$post_id"] },
              },
            },
          ],
          as: "like",
        },
      },
      {
        $lookup: {
          from: "downloads",
          let: { post_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$episodeId", "$$post_id"] },
              },
            },
          ],
          as: "download",
        },
      },
      {
        $lookup: {
          from: "views",
          let: { episode_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$episodeId", "$$episode_id"] },
              },
            },
          ],
          as: "view",
        },
      },
      {
        $addFields: {
          likeNum: { $size: "$like" },
          disLikeNum: { $size: "$disLike" },
          downloadCount: { $size: "$download" },
          viewCount: { $size: "$view" },
        },
      },
      {
        $addFields: {
          likeCount: { $subtract: ["$likeNum", "$disLikeNum"] },
        },
      },
      { $sort: sort },
    ];

    try {
      const result = await this.helper.index(req, "episode", query, aggregateData);
      if (!result) return this.abort(res, 500, logcode);
      if (!result.docs || !result.docs[0]) return this.abort(res, 404, logcode);
      await this.model.View.create({ episodeId: req.params.id });
      const Transform = await this.helper.transform(result.docs[0], this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
