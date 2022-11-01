const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class updateController extends InitializeController {
  async update(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;
    let values = {};
    let query = {};
    if (req.body.episode) {
      try {
        const e = req.body.episode.split(",");
        values = { ...values, episode: e };
      } catch (err) {
        return this.abort(res, 400, logcode, "فرمت وارد شده برای اپیزود اشتباه است");
      }
    }
    if (req.body.name) {
      values = { ...values, name: req.body.name };
    }
    try {
      if (req.user.type === "user") query = { ...query, userId: mongoose.Types.ObjectId(req.user._id) };
      const playList = await this.model.PlayList.findOne(query).exec();
      if (!playList) return this.abort(res, 404, logcode, null, "id");
      await this.model.PlayList.findByIdAndUpdate(req.params.id, values).exec();
      return this.ok(res, logcode, "با موفقیت اپدیت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
