const InitializeController = require("./initializeController");

module.exports = new (class destroyController extends InitializeController {
  async destroy(req, res) {
    try {
      await this.model.User.findByIdAndRemove(req.user._id).exec();
      return this.ok(res, logcode, "با موفقیت حذف شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
