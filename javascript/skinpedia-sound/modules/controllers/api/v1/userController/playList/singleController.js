const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;
    try {
      let query = { _id: req.params.id };
      if (req.user.type === "user") query = { ...query, userId: mongoose.Types.ObjectId(req.user._id) };
      const playList = await this.model.PlayList.findOne(query).exec();
      if (!playList) return this.abort(res, 404, logcode, null, "id");
      const Transform = await this.helper.transform(playList, this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
