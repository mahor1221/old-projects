const InitializeController = require("./initializeController");

module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("episode", "اپیزود نمیتواند خالی باشد").notEmpty();
    req.checkBody("name", "نام نمیتواند خالی باشد").notEmpty();
    if (this.validation(req, res)) return "";
    let values = { userId: req.user._id, name: req.body.name };
    try {
      const e = req.body.episode.split(",");
      values = { ...values, episode: e };
    } catch (err) {
      return this.abort(res, 400, logcode, "فرمت وارد شده برای اپیزود اشتباه است");
    }
    try {
      await this.model.PlayList.create(values);
      return this.ok(res, logcode, "با موفقیت ثبت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
