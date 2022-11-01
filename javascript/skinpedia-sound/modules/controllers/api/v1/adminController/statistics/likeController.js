const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class likeController extends InitializeController {
  async like(req, res) {
    //
    try {
      let query = {};
      const data = [];
      const date = new Date();
      const moment = new Date(date.setUTCHours(0, 0, 0, 0));
      console.log(moment);
      if (req.query.postId) {
        req.checkQuery("postId", "ایدی زیر محصول وارد شده صحیح نیست").isMongoId();
        if (this.validation(req, res)) return;
        query = { ...query, postId: mongoose.Types.ObjectId(req.query.postId) };
      }
      const start = Date.parse(moment) - 2592000000;
      for (let index = start; index <= moment; index += 86400000) {
        const day = await this.model.Like.countDocuments({
          ...query,
          createdAt: { $gte: new Date(index), $lte: new Date(index + 86400000) },
        }).exec();
        let count = day;
        data.push({ time: new Date(index), count: count });
        if (index >= Date.parse(moment)) {
          data.sort(function (a, b) {
            const dateA = new Date(a.time);
            const dateB = new Date(b.time);
            return dateA - dateB;
          });
          query = { ...query, createdAt: { $gte: new Date(start), $lte: moment } };
          const results = await this.model.Like.countDocuments(query).exec();
          return this.helper.response(res, null, logcode, 200, { count: results, statistics: data });
        }
      }
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
