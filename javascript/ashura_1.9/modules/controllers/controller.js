// Model
const Post = require(`${config.path.model}/post`);
const Category = require(`${config.path.model}/category`);
const Admin = require(`${config.path.model}/admin`);
const Tag = require(`${config.path.model}/tag`);
const SuperAdmin = require(`${config.path.model}/superAdmin`);
const ShortLink = require(`${config.path.model}/shortLink`);
const Download = require(`${config.path.model}/statistics/download`);
const Like = require(`${config.path.model}/statistics/like`);
const DisLike = require(`${config.path.model}/statistics/disLike`);
const Upload = require(`${config.path.model}/upload`);



module.exports = class Controller {
    constructor() {
        this.model = { Post, Category, Tag, Admin, SuperAdmin, ShortLink , Download , Like , DisLike, Upload};
    }

    showValidationErrors(req, res, callback) {
        let errors = req.validationErrors();
        if (errors) {
            res.status(422).json({
                message: errors.map((error) => {
                    return {
                        field: error.param,
                        message: error.msg,
                    };
                }),
                success: false,
            });
            return true;
        }
        return false;
    }

    escapeAndTrim(req, items) {
        items.split(" ").forEach((item) => {
            req.sanitize(item).escape();
            req.sanitize(item).trim();
        });
    }

    trim(req, items) {
        items.split(" ").forEach((item) => {
            req.sanitize(item).trim();
        });
    }
};
