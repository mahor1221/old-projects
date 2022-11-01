const Transform = require("../.././transform");
module.exports = class postLikeStatisticsTransform extends Transform {
    transform(item) {
        return item._id;
    }
};
