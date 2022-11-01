const InitializeController = require("./initializeController");
module.exports = new (class logoutController extends InitializeController {
  async logout(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return "";
    try {
      let query = { _id: req.params.id };
      if (req.user.type != "superAdmin") query = { ...query, userId: req.user._id };
      const token = await this.model.Token.findOne(query).exec();
      if (!token) return this.abort(res, 404, logcode, null, "id");
      if (token.userId !== req.user._id) return this.abort(res, 404, logcode, null, "id");
      await this.model.Token.findByIdAndRemove(token._id).exec();
      return this.ok(res, logcode, "با موفقیت حذف شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
