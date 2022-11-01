const Controller = require(`${config.path.controller}/controller`);
const categoryTransform = require(`${config.path.transform}/api/v1/Admin/categoryTransform`);

module.exports = new (class categoryController extends Controller {
    store(req, res) {
        // Validation
        req.checkBody("title", "عنوان نمیتواند خالی بماند").notEmpty();
        this.escapeAndTrim(req, "title");
        if (req.body.image !== undefined) this.trim(req, "image");
        if (this.showValidationErrors(req, res)) return;

        var values = { title: req.body.title };
        if (req.body.image !== undefined) values = { ...values, image: req.body.image };
        this.model.Category(values).save((err, category) => {
            if (err) throw err;
            res.json({
                status: 200,
                data: new categoryTransform().transform(category),
                Message: "create success",
                success: true,
            });
        });
    }

    update(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        // Validation
        req.checkBody("title", "عنوان نمیتواند خالی بماند").notEmpty();
        this.escapeAndTrim(req, "title");
        if (req.body.image !== undefined) this.escapeAndTrim(req, "image");
        if (this.showValidationErrors(req, res)) return;

        var values = { title: req.body.title };
        if (req.body.image !== undefined) values = { ...values, image: req.body.image };
        this.model.Category.findByIdAndUpdate(req.params.id, values, (err, category) => {
            res.json({
                status: 200,
                data: new categoryTransform().transform(category),
                title : req.body.title,
                Message: "Update success",
                success: true,
            });
        });
    }

    destroy(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        this.model.Category.findByIdAndRemove(req.params.id, (err, category) => {
            if (err) throw err;
            res.json({
                status: 200,
                Message: "delete success",
                success: true,
            });
        });
    }
})();
