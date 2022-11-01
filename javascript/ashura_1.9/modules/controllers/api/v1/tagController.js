const Controller = require(`${config.path.controller}/controller`);
const tagTransform = require(`${config.path.transform}/api/v1/tagTransform`);

module.exports = new (class tagController extends Controller {
    index(req, res) {
        const query = {};
        const options = { page: req.query.page || 1, limit: 21 };
        this.model.Tag.paginate(query, options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new tagTransform().withPaginate().transformCollection(result),
                        success: true,
                        status: 200,
                    });
                } else {
                    res.json({
                        message: "Tags empty",
                        success: false,
                        status: 404,
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    single(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        this.model.Tag.findById(req.params.id, (err, result) => {
            if (result) {
                return res.json({
                    data: new tagTransform().transform(result),
                    success: true,
                    status: 200,
                });
            } else {
                res.status(404).json({
                    data: "not found",
                    success: false,
                    status: 404,
                });
            }
        });
    }

    trend(req, res) {
        const options = { page: req.query.page || 1, limit: 21 };
        const query = { isTrend: true };

        this.model.Tag.paginate(query, options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new tagTransform().withPaginate().transformCollection(result),
                        success: true,
                        status: 200,
                    });
                } else {
                    res.json({
                        message: "Posts empty",
                        success: false,
                        status: 404,
                    });
                }
            })
            .catch((err) => console.log(err));
    }
})();
