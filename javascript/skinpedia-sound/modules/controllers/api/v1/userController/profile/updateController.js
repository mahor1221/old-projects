const InitializeController = require("./initializeController");
const bcrypt = require("bcrypt");

module.exports = new (class updateController extends InitializeController {
  async update(req, res) {
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
      await this.model.User.findByIdAndUpdate(req.user._id, values).exec();
      return this.ok(res, logcode, "با موفقیت اپدیت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
