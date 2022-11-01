const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class updateController extends InitializeController {
  async update(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;
    let values = {};
    if (req.body.category) {
      try {
        const c = req.body.category.split(",");
        for (const id of c) if (id != mongoose.Types.ObjectId(id)) throw "";
        values = { ...values, category: c };
      } catch (err) {
        return this.abort(res, 400, logcode, "فرمت وارد شده برای دسته بندی اشتباه است");
      }
    }
    if (req.body.image) {
      values = { ...values, image: req.body.image };
    }
    if (req.body.link) {
      values = { ...values, link: req.body.link };
    }
    if (req.body.description) {
      values = { ...values, description: req.body.description };
    }
    if (req.body.title) {
      values = { ...values, title: req.body.title };
    }
    if (req.body.status) {
      req.checkBody("status", "مقدار وارد شده برای فیلد وضعیت اشتباه است").isIn(["active", "deactivated"]);
      if (this.validation(req, res)) return;
      values = { ...values, status: req.query.status };
    }
    try {
      const episode = await this.model.Episode.findById(req.params.id).exec();
      if (!episode) return this.abort(res, 404, logcode, null, "id");
      await this.model.Episode.findByIdAndUpdate(req.params.id, values).exec();
      return this.ok(res, logcode, "با موفقیت اپدیت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
