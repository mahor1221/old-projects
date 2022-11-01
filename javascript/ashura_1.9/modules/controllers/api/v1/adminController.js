const Controller = require(`${config.path.controller}/controller`);
const adminTransform = require(`${config.path.transform}/api/v1/adminTransformLogin`);
const bcrypt = require("bcrypt");

module.exports = new (class adminController extends Controller {
  login(req, res) {
    req.checkBody("email", "وارد کردن فیلد ایمیل الزامیست").notEmpty();
    req.checkBody("password", "وارد کردن فیلد پسورد الزامیست").notEmpty();

    if (this.showValidationErrors(req, res)) return;

    this.model.Admin.findOne({ email: req.body.email }, (err, admin) => {
      if (err) throw err;

      if (admin == null)
        return res.status(422).json({
          data: "اطلاعات وارد شده صحیح نیست",
          success: false,
          status: 422,
        });

      bcrypt.compare(req.body.password, admin.password, (err, status) => {
        if (!status)
          return res.status(422).json({
            success: false,
            data: "پسورد وارد شده صحیح نمی باشد",
            status: 422,
          });
        return res.json({
          isSuperAdmin: false,
          data: new adminTransform().transform(admin),
          success: true,
          status: 200,
        });
      });
    });
  }
})();
