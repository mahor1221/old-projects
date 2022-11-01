const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class destroyController extends InitializeController {
  async destroy(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;

    let query = {};

    try {
      if (req.user.type === "user") query = { ...query, userId: mongoose.Types.ObjectId(req.user._id) };
      const playList = await this.model.PlayList.findOne(query).exec();
      if (!playList) return this.abort(res, 404, logcode, null, "id");
      await this.model.PlayList.findByIdAndRemove(req.params.id).exec();
      return this.ok(res, logcode, "با موفقیت حذف شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
