const InitializeController = require("./initializeController");
module.exports = new (class destroyController extends InitializeController {
  async destroy(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return "";
    try {
      const user = await this.model.User.findById(req.params.id).exec();
      if (!user) return this.abort(res, 404, logcode, null, "id");
      await this.model.User.findByIdAndRemove(req.params.id).exec();
      return this.ok(res, logcode, "با موفقیت حذف شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
