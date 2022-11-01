const InitializeController = require("./initializeController");

module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("title", "عنوان نمیتواند خالی باشد").notEmpty();
    req.checkBody("image", "تصویر نمیتواند خالی باشد").notEmpty();
    if (this.validation(req, res)) return "";
    let values = { title: req.body.title, image: req.body.image };
    try {
      await this.model.Category.create(values);
      return this.ok(res, logcode, "با موفقیت ثبت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
