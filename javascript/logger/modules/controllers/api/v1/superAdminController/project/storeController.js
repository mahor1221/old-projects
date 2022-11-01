const InitializeController = require("./initializeController");
module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("name", "نام نمیتواند خالی بماند").notEmpty();
    let values = { name: req.body.name };
    if (this.validation(req, res)) return "";
    try {
      await this.model.Project.create(values);
      return this.ok(res, logcode, "با موفقیت اضافه شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
