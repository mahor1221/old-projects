const InitializeController = require("./initializeController");
const bcrypt = require("bcrypt");

module.exports = new (class updateController extends InitializeController {
  async update(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;
    // Validation
    let values = {};
    if (req.body.name) {
      values = { ...values, name: req.body.name };
    }
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      values = { ...values, password: hash };
    }
    
    try {
      const user = await this.model.User.findById(req.params.id).exec();
      if (!user) return this.abort(res, 404, logcode, null, "id");
      if (user.type === "superAdmin") return this.abort(res, 404, logcode, null, "id");
      await this.model.User.findByIdAndUpdate(req.params.id, values).exec();
      return this.ok(res, logcode, "با موفقیت اپدیت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
