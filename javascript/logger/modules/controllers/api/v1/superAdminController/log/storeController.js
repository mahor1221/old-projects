const InitializeController = require("./initializeController.js");
const shortUuid = require("short-uuid");
module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("ip", "آی پی نمیتواند خالی باشد").notEmpty();
    req.checkBody("data", "دیتا نمیتواند خالی باشد").notEmpty();
    req.checkBody("sectionId", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;
    const data = req.body.data.length <= 50 ? req.body.data : req.body.data.substring(0, 50);

    try {
      const section = await this.model.Section.findById(req.body.sectionId);
      if (!section) return this.abort(res, 404, logcode, null, "sectionId");
      let values = { sectionId: req.body.sectionId, ip: req.body.ip, logcode: shortUuid().new(), data };
      let result = await this.model.Log.create(values);
      const Transform = await this.helper.transform(result, this.helper.itemTransform);
      return this.helper.response(res, "با موفقیت اضافه شد", logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
