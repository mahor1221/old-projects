const InitializeController = require("./initializeController");

module.exports = new (class updateController extends InitializeController {
  async update(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;
    let values = {};
    if (req.body.title) {
      values = { ...values, title: req.body.title };
    }
    if (req.body.image) {
      values = { ...values, image: req.body.image };
    }
    try {
      const category = await this.model.Category.findById(req.params.id).exec();
      if (!category) return this.abort(res, 404, logcode, null, "id");
      await this.model.Category.findByIdAndUpdate(req.params.id, values).exec();
      return this.ok(res, logcode, "با موفقیت اپدیت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
