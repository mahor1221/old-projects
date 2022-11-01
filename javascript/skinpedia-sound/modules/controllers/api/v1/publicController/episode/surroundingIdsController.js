const InitializeController = require("./initializeController");
module.exports = new (class surroundingIdsController extends InitializeController {
  async surroundingIds(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;
    try {
      let surroundingIds = {};
      let success = false;
      const projection = { _id: 1 };
      //query for getting next ID
      const query1 = { status: "active", _id: { $gt: req.params.id } };
      const sort1 = { _id: 1 };
      //query for getting Previous ID
      const query2 = { status: "active", _id: { $lt: req.params.id } };
      const sort2 = { _id: -1 };
      const episodeNext = await this.model.Episode.findOne(query1, projection).sort(sort1).exec();
      if (episodeNext) {
        surroundingIds = { next: episodeNext._id };
        success = true;
      }
      const episodePrevious = await this.model.Episode.findOne(query2, projection).sort(sort2).exec();
      if (episodePrevious) {
        surroundingIds = { ...surroundingIds, previous: episodePrevious._id };
        success = true;
      }
      if (success) return this.helper.response(res, null, logcode, 200, surroundingIds);
      else return this.abort(res, 404, logcode);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
