const Controller = require(`${config.path.controller}/controller`);
const adminUpdateTransform = require(`${config.path.transform}/api/v1/Admin/adminTransform`);
const adminTransform = require(`${config.path.transform}/api/v1/adminTransform`);
const bcrypt = require("bcrypt");

module.exports = new (class adminController extends Controller {
    register(req, res) {
        req.checkBody("name", "وارد کردن فیلد نام الزامیست").notEmpty();
        req.checkBody("email", "وارد کردن فیلد ایمیل الزامیست").notEmpty();
        req.checkBody("password", "وارد کردن فیلد پسورد الزامیست").notEmpty();
        req.checkBody("email", "فرمت اییمل وارد شده صحیح نیست").isEmail();

        if (this.showValidationErrors(req, res)) return;

        this.model
            .Admin({ name: req.body.name, email: req.body.email, password: req.body.password })
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
    index(req, res) {
        const query = {};
        const options = { page: req.query.page || 1, limit: 21 };
        this.model.Admin.paginate(query, options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new adminTransform().withPaginate().transformCollection(result),
                        success: true,
                        status: 200,
                    });
                }

                res.json({
                    message: "Admins empty",
                    success: false,
                    status: 404,
                });
            })
            .catch((err) => console.log(err));
    }

    single(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        this.model.Admin.findById(req.params.id, (err, admin) => {
            if (admin) {
                return res.json({
                    data: new adminTransform().transform(admin),
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

            this.model.Admin.findByIdAndUpdate(
                req.params.id,
                { password: req.body.password, name: req.body.name },
                (err, admin) => {
                    res.json({
                        status: 200,
                        data: new adminUpdateTransform().transform(admin),
                        Message: "Update success",
                        success: true,
                    });
                }
            );
        });
    }
    destroy(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        this.model.Admin.findByIdAndRemove(req.params.id, (err, admin) => {
            if (err) throw err;
            res.json({
                status: 200,
                Message: "delete success",
                success: true,
            });
        });
    }
})();
