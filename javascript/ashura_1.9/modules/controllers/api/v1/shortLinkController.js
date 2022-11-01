const Controller = require(`${config.path.controller}/controller`);
const shortLinkTransform = require(`${config.path.transform}/api/v1/shortLinkTransform`);
const postTransform = require(`${config.path.transform}/api/v1/postTransform`);

module.exports = new (class shortLinkController extends Controller {
    index(req, res) {
        const query = {};
        const options = { page: req.query.page || 1, limit: 21 };
        this.model.ShortLink.paginate(query, options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new shortLinkTransform().withPaginate().transformCollection(result),
                        success: true,
                        status: 200,
                    });
                }
                res.json({
                    message: "Short Links empty",
                    success: false,
                    status: 404,
                });
            })
            .catch((err) => console.log(err));
    }

    single(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        this.model.ShortLink.findById(req.params.id, (err, result) => {
            if (err) throw err;
            if (result) {
                return res.json({
                    data: new shortLinkTransform().transform(result),
                    success: true,
                    status: 200,
                });
            }
            res.status(404).json({
                data: "not found",
                success: false,
                status: 404,
            });
        });
    }

    shorten(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        const query = { post: req.params.id };
        const project = {};
        this.model.ShortLink.findOne(query, project, (err, result) => {
            if (err) throw err;
            if (result) {
                return res.json({
                    data: new shortLinkTransform().transform(result),
                    success: true,
                    status: 200,
                });
            }

            const value = { post: req.params.id };
            this.model.ShortLink(value).save((err, result) => {
                if (err) throw err;
                res.json({
                    data: new shortLinkTransform().transform(result),
                    Message: "create success",
                    success: true,
                    status: 200,
                });
            });
        });
    }

    getPostIdbyShortLink(req, res) {
        req.checkParams("link", "لینک نمیتواند خالی بماند").notEmpty();
        this.escapeAndTrim(req, "link");
        if (this.showValidationErrors(req, res)) return;

        const query = { link: req.params.link };
        this.model.ShortLink.findOne(query, (err, result) => {
            if (err) throw err;
            if (result) {
                return res.json({
                    data: new shortLinkTransform().transform(result),
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

    elongate(req, res) {
        req.checkParams("link", "لینک نمیتواند خالی بماند").notEmpty();
        this.escapeAndTrim(req, "link");
        if (this.showValidationErrors(req, res)) return;

        const query = { link: req.params.link };
        const aggregate = [
            { $match: query },
            { $lookup: { from: "posts", localField: "post", foreignField: "_id", as: "posts" } },
            { $project: { _id: 0, post: 0, link: 0 } },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: [{ $arrayElemAt: ["$posts", 0] }, "$$ROOT"] },
                },
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $project: {
                    posts: 0,
                    "tags.updatedAt": 0,
                    "tags.createdAt": 0,
                    "tags.__v": 0,
                    "category.updatedAt": 0,
                    "category.createdAt": 0,
                    "category.__v": 0,
                },
            },
        ];

        this.model.ShortLink.aggregate(aggregate, (err, result) => {
            if (err) throw err;
            if (result) {
                result = result[0];
                return res.json({
                    data: new postTransform().transform(result),
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
