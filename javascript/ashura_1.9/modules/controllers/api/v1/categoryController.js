const Controller = require(`${config.path.controller}/controller`);
const categoryTransform = require(`${config.path.transform}/api/v1/categoryTransform`);

module.exports = new (class categoryController extends Controller {
    index(req, res) {
        const query = {};
        const options = { page: req.query.page || 1, limit: 21 };
        this.model.Category.paginate(query, options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new categoryTransform().withPaginate().transformCollection(result),
                        success: true,
                        status: 200,
                    });
                } else {
                    res.json({
                        message: "Categories empty",
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

        this.model.Category.findById(req.params.id, (err, result) => {
            if (result) {
                return res.json({
                    data: new categoryTransform().transform(result),
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
})();
