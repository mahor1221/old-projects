const Controller = require(`${config.path.controller}/controller`);
const shortLinkTransform = require(`${config.path.transform}/api/v1/Admin/shortLinkTransform`);

module.exports = new (class shortLinkController extends Controller {
    store(req, res) {
        // Validation
        req.checkBody("link", "لینک نمیتواند خالی بماند").notEmpty();
        this.escapeAndTrim(req, "link");
        if (this.showValidationErrors(req, res)) return;

        this.model.ShortLink({ link: req.body.link }).save((err, shortLink) => {
            if (err) throw err;
            res.json({
                status: 200,
                data: new shortLinkTransform().transform(shortLink),
                Message: "create success",
                success: true,
            });
        });
    }

    update(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;
        // Validation
        req.checkBody("link", "لینک نمیتواند خالی بماند").notEmpty();
        this.escapeAndTrim(req, "link");
        if (this.showValidationErrors(req, res)) return;

        this.model.ShortLink.findByIdAndUpdate(
            req.params.id,
            { link: req.body.link },
            (err, shortLink) => {
                res.json({
                    status: 200,
                    data: new shortLinkTransform().transform(shortLink),
                    Message: "Update success",
                    success: true,
                });
            }
        );
    }
    destroy(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        this.model.ShortLink.findByIdAndRemove(req.params.id, (err, shortLink) => {
            if (err) throw err;
            res.json({
                status: 200,
                Message: "delete success",
                success: true,
            });
        });
    }
})();
