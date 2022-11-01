const Controller = require(`${config.path.controller}/controller`);
const superAdminTransform = require(`${config.path.transform}/api/v1/superAdminTransform`);
const adminSuperAdminUpdateTransform = require(`${config.path.transform}/api/v1/Admin/superAdminUpdateTransform`);
const adminSuperAdminTransform = require(`${config.path.transform}/api/v1/Admin/superAdminTransform`);
const bcrypt = require("bcrypt");

module.exports = new (class superAdminController extends Controller {
    login(req, res) {
        req.checkBody("email", "وارد کردن فیلد ایمیل الزامیست").notEmpty();
        req.checkBody("password", "وارد کردن فیلد پسورد الزامیست").notEmpty();

        if (this.showValidationErrors(req, res)) return;

        this.model.SuperAdmin.findOne({ email: req.body.email }, (err, superAdmin) => {
            if (err) throw err;

            if (superAdmin == null)
                return res.status(422).json({
                    data: "اطلاعات وارد شده صحیح نیست",
                    success: false,
                    status: 422,
                });

            bcrypt.compare(req.body.password, superAdmin.password, (err, status) => {
                if (!status)
                    return res.status(422).json({
                        success: false,
                        data: "پسورد وارد شده صحیح نمی باشد",
                        status: 422,
                    });

                return res.json({
                    isSuperAdmin :true,
                    data: new superAdminTransform().transform(superAdmin),
                    success: true,
                    status: 200,
                });
            });
        });
    }

    register(req, res) {
        req.checkBody("name", "وارد کردن فیلد نام الزامیست").notEmpty();
        req.checkBody("email", "وارد کردن فیلد ایمیل الزامیست").notEmpty();
        req.checkBody("password", "وارد کردن فیلد پسورد الزامیست").notEmpty();
        req.checkBody("email", "فرمت اییمل وارد شده صحیح نیست").isEmail();

        if (this.showValidationErrors(req, res)) return;

        this.model
            .SuperAdmin({ name: req.body.name, email: req.body.email, password: req.body.password })
            .save((err) => {
                if (err) {
                    if (err.code == 11000) {
                        return res.json({
                            data: "ایمیل نمی تواند تکراری باشد",
                            success: false,
                            status: 404,
                        });
                    } else {
                        throw err;
                    }
                }

                return res.json({
                    data: "کاربر با موفقیت عضو وبسایت شد",
                    success: true,
                    status: 200,
                });
            });
    }
    single(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        this.model.SuperAdmin.findById(req.params.id, (err, admin) => {
            if (admin) {
                return res.json({
                    data: new adminSuperAdminTransform().transform(admin),
                    success: true,
                    status: "200",
                });
            }

            res.status(404).json({
                data: "not found",
                success: false,
                status: "404",
            });
        });
    }
    update(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        // Validation
        req.checkBody("name", "نام نمیتواند خالی بماند").notEmpty();
        req.checkBody("password", "رمز نمیتواند خالی بماند").notEmpty();
        this.escapeAndTrim(req, "password");

        if (this.showValidationErrors(req, res)) return;
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            req.body.password = hash;

            this.model.SuperAdmin.findByIdAndUpdate(
                req.params.id,
                { password: req.body.password, name: req.body.name },
                (err, superAdmin) => {
                    res.json({
                        status: 200,
                        data: new adminSuperAdminUpdateTransform().transform(superAdmin),
                        Message: "Update success",
                        success: true,
                    });
                }
            );
        });
    }
})();
