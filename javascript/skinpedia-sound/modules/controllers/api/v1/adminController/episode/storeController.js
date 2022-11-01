const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("title", "عنوان نمیتواند خالی باشد").notEmpty();
    req.checkBody("description", "متن نمیتواند خالی باشد").notEmpty();
    req.checkBody("link", "لینک نمیتواند خانی باشد").notEmpty();
    req.checkBody("image", "تصویر نمیتواند خالی باشد").notEmpty();
    req.checkBody("category", "دسته بندی نمیتواند خالی باشد").notEmpty();
    if (this.validation(req, res)) return "";
    let values = {
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      image: req.body.image,
    };

    try {
      const c = req.body.category.split(",");
      for (const id of c) if (id != mongoose.Types.ObjectId(id)) throw "";
      values = { ...values, category: c };
    } catch (err) {
      return this.abort(res, 400, logcode, "فرمت وارد شده برای دسته بندی اشتباه است");
    }

    try {
      await this.model.Episode.create(values);
      return this.ok(res, logcode, "با موفقیت ثبت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
