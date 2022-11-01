const Controller = require(`${config.path.controller}/controller`);
const tagTransform = require(`${config.path.transform}/api/v1/Admin/tagTransform`);

module.exports = new (class tagController extends Controller {
    store(req, res) {
        // Validation
        req.checkBody("title", "عنوان نمیتواند خالی بماند").notEmpty();
        req.checkBody("isTrend", "ترند نمیتواند خالی باشد").notEmpty();
        if (req.body.isTrend !== undefined)
            req.checkBody("isTrend", "فقط مقدار بولین قابل قبول است").isBoolean();
        this.escapeAndTrim(req, "title");
        if (this.showValidationErrors(req, res)) return;

        this.model.Tag({
            title: req.body.title,
            isTrend: req.body.isTrend,
        }).save((err, tag) => {
            if (err) throw err;
            res.json({
                status: 200,
                data: new tagTransform().transform(tag),
                Message: "create success",
                success: true,
            });
        });
    }


    update(req, res) {
        // Validation
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        req.checkBody("title", "عنوان نمیتواند خالی بماند").notEmpty();
        req.checkBody("isTrend", "ترند نمیتواند خالی باشد").notEmpty();
        if (req.body.isTrend !== undefined)
            req.checkBody("isTrend", "فقط مقدار بولین قابل قبول است").isBoolean();
        this.escapeAndTrim(req, "title");
        if (this.showValidationErrors(req, res)) return;

        this.model.Tag.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                isTrend: req.body.isTrend,
            },
            (err, tag) => {
                if (err) throw err;
                res.json({
                    status: 200,
                    data: new tagTransform().transform(tag),
                    title :  req.body.title,
                    isTrend : req.body.isTrend,
                    Message: "Update success",
                    success: true,
                });
            }
        );
    }


    destroy(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        this.model.Tag.findByIdAndRemove(req.params.id, (err, tag) => {
            if (err) throw err;
            res.json({
                status: 200,
                Message: "delete success",
                success: true,
            });
        });
    }
})();
