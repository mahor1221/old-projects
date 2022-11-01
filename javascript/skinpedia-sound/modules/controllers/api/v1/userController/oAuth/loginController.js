const InitializeController = require("./initializeController");
const bcrypt = require("bcrypt");

module.exports = new (class loginController extends InitializeController {
  async login(req, res) {
    req.checkBody("email", "وارد کردن فیلد ایمیل الزامیست").notEmpty();
    req.checkBody("password", "وارد کردن فیلد پسورد الزامیست").notEmpty();
    if (this.validation(req, res)) return "";
    //
    try {
      const recaptcha = await this.helper.recaptcha(req.body["g-recaptcha-response"], req.connection.remoteAddress);
      if (!recaptcha.data.success) return this.abort(res, 401, logcode, "کپچا اشتباه است");
      const user = await this.model.User.findOne({ email: req.body.email, type: "user" }).exec();
      if (!user) return this.abort(res, 401, logcode);
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return this.abort(res, 401, logcode);
      const Transform = await this.helper.transform(
        user,
        this.helper.itemTransform,
        false,
        "user",
        req.connection.remoteAddress,
        req.get("User-Agent")
      );
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
