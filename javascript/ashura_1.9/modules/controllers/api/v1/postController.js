const mongoose = require("mongoose");
const { post, get } = require("../../../routes/api/api-v1");
const Controller = require(`${config.path.controller}/controller`);

const moment = require('moment');
const e = require("express");
const toMonth = moment().startOf('month')

const uploadTransform = require(`${config.path.transform}/api/v1/uploadTransform`);

const postTransform = require(`${config.path.transform}/api/v1/postTransform`);
const tagTransform = require(`${config.path.transform}/api/v1/tagTransform`);
const postLikeTransform = require(`${config.path.transform}/api/v1/postLikeTransform`);
const postViewTransform = require(`${config.path.transform}/api/v1/postViewTransform`);
const postDownloadTransform = require(`${config.path.transform}/api/v1/postDownloadTransform`);


module.exports = new (class postController extends Controller {
    index(req, res) {
        var query = {};
        var sort = {};

        if (req.query.s !== undefined) {
            this.escapeAndTrim(req, "s");
            if (this.showValidationErrors(req, res)) return;
            query = { $text: { $search: `/${req.query.s}/i` } };
            // query = { description: { $regex: `${req.query.s}` } };
            sort = { sort: { score: { $meta: "textScore" } } };
        }
        if (req.query.tag !== undefined) {
            req.checkQuery("tag", "ای دی وارد شده صحیح نیست").isMongoId();
            if (this.showValidationErrors(req, res)) return;
            query = { ...query, tags: mongoose.Types.ObjectId(req.query.tag) };
        }
        if (req.query.cat !== undefined) {
            req.checkQuery("cat", "ای دی وارد شده صحیح نیست").isMongoId();
            if (this.showValidationErrors(req, res)) return;
            query = { ...query, category: mongoose.Types.ObjectId(req.query.cat) };
        }

        const options = {
            page: req.query.page || 1,
            limit: 21,
            ...sort,
        };
        const aggregate = this.model.Post.aggregate([
            { $match: query },
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
                    "tags.updatedAt": 0,
                    "tags.createdAt": 0,
                    "tags.__v": 0,
                    "category.updatedAt": 0,
                    "category.createdAt": 0,
                    "category.__v": 0,
                },
            },
        ]);

        this.model.Post.aggregatePaginate(aggregate, options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new postTransform().withPaginate().transformCollection(result),
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

    byCategory(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        const query = { category: mongoose.Types.ObjectId(req.params.id) };
        const options = { page: req.query.page || 1, limit: 21 };
        const aggregate = this.model.Post.aggregate([
            { $match: query },
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
                    "tags.updatedAt": 0,
                    "tags.createdAt": 0,
                    "tags.__v": 0,
                    "category.updatedAt": 0,
                    "category.createdAt": 0,
                    "category.__v": 0,
                },
            },
        ]);

        this.model.Post.aggregatePaginate(aggregate, options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new postTransform().withPaginate().transformCollection(result),
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

    byTag(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        const query = { tags: mongoose.Types.ObjectId(req.params.id) };
        // const options = { page: req.query.page || 1, limit: 21, populate: ["categories"] };
        // const aggregate = this.model.Post.aggregate([
        const aggregate = [
            { $match: query },
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
                    "tags.updatedAt": 0,
                    "tags.createdAt": 0,
                    "tags.__v": 0,
                    "category.updatedAt": 0,
                    "category.createdAt": 0,
                    "category.__v": 0,
                },
            },
        ];

        this.model.Tag.findById(req.params.id, (err, result1) => {
            if (err) throw err;
            if (result1) {
                this.model.Post.aggregate(aggregate, (err, result2) => {
                    if (err) throw err;
                    if (result2 && result2.length > 0) {
                        return res.json({
                            tagData: new tagTransform().transform(result1),
                            data: new postTransform().transformCollection(result2),
                            success: true,
                            status: 200,
                        });
                    } else {
                        res.json({
                            tagData: new tagTransform().transform(result1),
                            message: "Posts empty",
                            success: false,
                            status: 404,
                        });
                    }
                })

            } else {
                res.json({
                    message: "Tags empty",
                    success: false,
                    status: 404,
                });
            }
        });

        // this.model.Post.aggregatePaginate(aggregate, options)
        //     .then((result) => {
        //         if (result) {
        //             return res.json({
        //                 data: new postTransform().withPaginate().transformCollection(result),
        //                 success: true,
        //                 status: 200,
        //             });
        //         } else {
        //             res.json({
        //                 message: "Posts empty",
        //                 success: false,
        //                 status: 404,
        //             });
        //         }
        //     })
        //     .catch((err) => console.log(err));
    }

    tagsByCategory(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        const query = { category: mongoose.Types.ObjectId(req.params.id) };
        const aggregate = [
            { $match: query },
            { $unwind: "$tags" },
            { $group: { _id: null, tags: { $addToSet: "$tags" } } },
            { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } },
            { $project: { _id: 0 } },
            { $unwind: "$tags" },
            { $replaceRoot: { newRoot: "$tags" } },
        ];

        this.model.Post.aggregate(aggregate, (err, result) => {
            if (err) throw err;
            if (result) {
                return res.json({
                    data: new tagTransform().transformCollection(result),
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
    }

    trend(req, res) {
        const options = { page: req.query.page || 1, limit: 21 };
        const aggregate = this.model.Tag.aggregate([
            { $match: { isTrend: true } },
            { $project: { _id: 1 } },
            { $group: { _id: null, tags: { $push: "$_id" } } },
            { $lookup: { from: "posts", localField: "tags", foreignField: "tags", as: "posts" } },
            { $project: { _id: 0, posts: 1 } },
            { $unwind: "$posts" },
            { $replaceRoot: { newRoot: { $mergeObjects: ["$posts", "$$ROOT"] } } },
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
                    "tags.updatedAt": 0,
                    "tags.createdAt": 0,
                    "tags.__v": 0,
                    "category.updatedAt": 0,
                    "category.createdAt": 0,
                    "category.__v": 0,
                },
            },
        ]);

        this.model.Tag.aggregatePaginate(aggregate, options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new postTransform().withPaginate().transformCollection(result),
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

    single(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        const query = { _id: req.params.id };
        const select = "-updatedAt -createdAt -__v";

        this.model.Post.findOne(query)
            .populate("category", select)
            .populate("tags", select)
            .exec((err, result) => {
                if (err) throw err;
                if (result) {
                    return res.json({
                        // result: result,
                        data: new postTransform().transform(result),
                        success: true,
                        status: 200,
                    });
                } else {
                    return res.json({
                        data: "Posts empty",
                        success: false,
                        status: 404,
                    });
                }
            });
    }

    SurroundingIds(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return;

        let surroundingIds = {};
        let success = false;

        const projection = { _id: 1 };
        //query for getting next ID
        const query1 = { _id: { $gt: req.params.id } };
        const sort1 = { _id: 1 };
        //query for getting Previous ID
        const query2 = { _id: { $lt: req.params.id } };
        const sort2 = { _id: -1 };

        this.model.Post.findOne(query1, projection)
            .sort(sort1)
            .exec((err, result) => {
                if (err) throw err;
                if (result) {
                    surroundingIds = { next: result._id };
                    success = true;
                }
            });

        this.model.Post.findOne(query2, projection)
            .sort(sort2)
            .exec((err, result) => {
                if (err) throw err;
                if (result) {
                    surroundingIds = { ...surroundingIds, previous: result._id };
                    success = true;
                }

                if (success) {
                    return res.json({
                        data: surroundingIds,
                        success: true,
                        status: 200,
                    });
                } else {
                    return res.status(404).json({
                        data: "Posts empty",
                        success: false,
                        status: 404,
                    });
                }
            });
    }

    like(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        this.model.Post.findById(req.params.id, (err, post) => {
            if (err) throw err;


            if (post) {
                let like = new postLikeTransform().transform(post);
                this.model.Like({
                    postId: req.params.id,

                }).save(() => {
                });
                this.model.Post.findByIdAndUpdate(
                    req.params.id,
                    { likeCount: parseInt(like) + parseInt(1) },
                    (err, post) => {
                        if (err) throw err;
                        res.json({
                            status: 200,
                            Message: "like success",
                            success: true,
                        });
                    }
                );
            }

        });
    }

    disLike(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        this.model.Post.findById(req.params.id, (err, post) => {
            if (err) throw err;
            if (post) {
                let like = new postLikeTransform().transform(post);

                this.model.DisLike({
                    postId: req.params.id,

                }).save(() => {
                });


                this.model.Post.findByIdAndUpdate(
                    req.params.id,
                    { likeCount: parseInt(like) + parseInt(-1) },
                    (err, post) => {
                        if (err) throw err;
                        res.json({
                            status: 200,
                            Message: "dislike success",
                            success: true,
                        });
                    }
                );
            }
        });
    }

    view(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        this.model.Post.findById(req.params.id, (err, post) => {
            if (err) throw err;
            if (post) {
                let view = new postViewTransform().transform(post);
                this.model.Post.findByIdAndUpdate(
                    req.params.id,
                    { viewCount: parseInt(view) + parseInt(1) },
                    (err, post) => {
                        if (err) throw err;
                        res.json({
                            status: 200,
                            Message: "view success",
                            success: true,
                        });
                    }
                );
            }
        });
    }

    download(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        this.model.Post.findById(req.params.id, (err, post) => {
            if (err) throw err;
            if (post) {
                let download = new postDownloadTransform().transform(post);
                this.model.Download({
                    postId: req.params.id,

                }).save(() => {
                });
                this.model.Post.findByIdAndUpdate(
                    req.params.id,
                    { downloadCount: parseInt(download) + parseInt(1) },
                    (err, post) => {
                        if (err) throw err;
                        res.json({
                            status: 200,
                            Message: "Download success",
                            success: true,
                        });
                    }
                );
            }
        });
    }
    // statisticsLikeAll(req,res){
    //     req.checkBody("s", "زمان شروع  نمیتواند خالی بماند").notEmpty();
    //     req.checkBody("e", "زمان پایان نمیتواند خالی بماند").notEmpty();
    //     this.escapeAndTrim(req, "s e");
    //     if (this.showValidationErrors(req, res)) return;
    //     this.model.Like.find(
    //         {
    //       createdAt: {
    //                       $gte: req.body.s,
    //                       $lte: req.body.e
    //                     }
    //                   }
    //         ).exec(function (err, results) {
    //                     var count = results.length
    //                          res.json({
    //                              f:req.body.s,
    //                              e:req.body.e,
    //                                     message: count,
    //                                     success: true,
    //                                     status: 200,
    //                                 });
    //                   });
    // }
    // statisticsDisLikeAll(req,res){
    //     req.checkBody("s", "زمان شروع  نمیتواند خالی بماند").notEmpty();
    //     req.checkBody("e", "زمان پایان نمیتواند خالی بماند").notEmpty();
    //     this.escapeAndTrim(req, "s e");
    //     if (this.showValidationErrors(req, res)) return;
    //     this.model.DisLike.find(
    //         {
    //       createdAt: {
    //                       $gte: req.body.s,
    //                       $lte: req.body.e
    //                     }
    //                   }
    //         ).exec(function (err, results) {
    //                     var count = results.length
    //                          res.json({
    //                              f:req.body.s,
    //                              e:req.body.e,
    //                                     message: count,
    //                                     success: true,
    //                                     status: 200,
    //                                 });
    //                   });
    // }
    // statisticsDownloadAll(req,res){
    //     req.checkBody("s", "زمان شروع  نمیتواند خالی بماند").notEmpty();
    //     req.checkBody("e", "زمان پایان نمیتواند خالی بماند").notEmpty();
    //     this.escapeAndTrim(req, "s e");
    //     if (this.showValidationErrors(req, res)) return;
    //     this.model.Download.find(
    //         {
    //       createdAt: {
    //                       $gte: req.body.s,
    //                       $lte: req.body.e
    //                     }
    //                   }
    //         ).exec(function (err, results) {
    //                     var count = results.length
    //                          res.json({
    //                              f:req.body.s,
    //                              e:req.body.e,
    //                                     message: count,
    //                                     success: true,
    //                                     status: 200,
    //                                 });
    //                   });
    // }
    // statisticsLikeByPostId(req,res){
    //     req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    //     req.checkBody("s", "زمان شروع  نمیتواند خالی بماند").notEmpty();
    //     req.checkBody("e", "زمان پایان نمیتواند خالی بماند").notEmpty();
    //     this.escapeAndTrim(req, "s e");
    //     if (this.showValidationErrors(req, res)) return;
    //     this.model.Like.find(
    //         {
    //       createdAt: {
    //                       $gte: req.body.s,
    //                       $lte: req.body.e
    //                     }
    //                   }
    //         ).exec(function (err, results) {

    //             var a = results.filter(function(el) {
    //                 return el.postId == req.params.id;
    //               });
    //             var count = a.length
    //                          res.json({
    //                              f:req.body.s,
    //                              e:req.body.e,
    //                                     message: count,
    //                                     success: true,
    //                                     status: 200,
    //                                 });
    //                   });
    // }
    // statisticsDisLikeByPostId(req,res){
    //     req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    //     req.checkBody("s", "زمان شروع  نمیتواند خالی بماند").notEmpty();
    //     req.checkBody("e", "زمان پایان نمیتواند خالی بماند").notEmpty();
    //     this.escapeAndTrim(req, "s e");
    //     if (this.showValidationErrors(req, res)) return;
    //     this.model.DisLike.find(
    //         {
    //       createdAt: {
    //                       $gte: req.body.s,
    //                       $lte: req.body.e
    //                     }
    //                   }
    //         ).exec(function (err, results) {

    //             var a = results.filter(function(el) {
    //                 return el.postId == req.params.id;
    //               });
    //             var count = a.length
    //                          res.json({
    //                              f:req.body.s,
    //                              e:req.body.e,
    //                                     message: count,
    //                                     success: true,
    //                                     status: 200,
    //                                 });
    //                   });
    // }
    // statisticsDownloadByPostId(req,res){
    //     req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    //     req.checkBody("s", "زمان شروع  نمیتواند خالی بماند").notEmpty();
    //     req.checkBody("e", "زمان پایان نمیتواند خالی بماند").notEmpty();
    //     this.escapeAndTrim(req, "s e");
    //     if (this.showValidationErrors(req, res)) return;
    //     this.model.Download.find(
    //         {
    //       createdAt: {
    //                       $gte: req.body.s,
    //                       $lte: req.body.e
    //                     }
    //                   }
    //         ).exec(function (err, results) {

    //             var a = results.filter(function(el) {
    //                 return el.postId == req.params.id;
    //               });
    //             var count = a.length
    //                          res.json({
    //                              f:req.body.s,
    //                              e:req.body.e,
    //                                     message: count,
    //                                     success: true,
    //                                     status: 200,
    //                                 });
    //                   });
    // }
    statisticsLikeAll(req, res) {
        for (let day = 2; day < 31; day++) {
            let a = 0; let s = 0;
            let month = 12;
            console.log(day);
            if (day < 10 || day - 1 < 10) {
                a = `2020-${month}-0${day}T08:45:08.664+00:00`;
                s = `2020-${month}-0${day - 1}T08:45:08.664+00:00`;
            }
            else {
                a = `2020-${month}-${day}T08:45:08.664+00:00`;
                s = `2020-${month}-${day - 1}T08:45:08.664+00:00`;
            }
            this.model.Like.find(
                {
                    createdAt: {
                        $gte: s,
                        $lte: a
                    }
                }

            ).exec(function (err, results) {
                console.log(a);
                console.log(results);
                // var count = results.length
                res.json({
                    //  f:lgt,
                    //  e:egt,
                    // message: count,
                    success: true,
                    status: 200,
                });
            });
        }
    }
    uploadImage(req, res) {

        if (req.file) {
            this.model.Upload({
                link: 'https://api.ashura.photo/' + req.file.path.replace(/\\/g, '/')
            }).save((err, Upload) => {
                if (err) throw err;
            });
            res.json({
                message: 'فایل شما با موفقیت آپلود گردید',
                data: {
                    imagePath: 'https://api.ashura.photo/' + req.file.path.replace(/\\/g, '/')
                },
                success: true
            })
        } else {
            res.json({
                message: 'فایل شما آپلود نشد',
                success: false
            })
        }
    }
    getUploadImage(req, res) {


        const options = {
            page: req.query.page || 1,
            limit: 21,

        };

        this.model.Upload.aggregatePaginate(options)
            .then((result) => {
                if (result) {
                    return res.json({
                        data: new uploadTransform().withPaginate().transformCollection(result),
                        success: true,
                        status: 200,
                    });
                } else {
                    res.json({
                        message: "UploadImage empty",
                        success: false,
                        status: 404,
                    });
                }
            })
            .catch((err) => console.log(err));
    }
})();
// for (let index = 0; index < array.length; index++) {
//     const element = array[index];

// }
// array.forEach(element => {

// });