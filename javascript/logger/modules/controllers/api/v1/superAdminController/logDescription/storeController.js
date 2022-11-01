const InitializeController = require("./initializeController.js");
module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("description", "توضیحات نمی‌تواند خالی باشد").notEmpty();
    req.checkBody("status", "وضعیت نمیتواند خالی باشد").notEmpty();
    req.checkBody("logcode", "لاگ کد نمی‌تواند خالی باشد").notEmpty();
    if (this.validation(req, res)) return;

    try {
      const log = await this.model.Log.findOne({ logcode: req.body.logcode });
      if (!log) return this.abort(res, 404, logcode, null, "logcode");
      let values = { description: req.body.description, status: req.body.status, logId: log._id };
      await this.model.LogDescription.create(values);
      return this.ok(res, logcode, "با موفقیت اضافه شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
