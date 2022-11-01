const Transform = require("../.././transform");
module.exports = class postLikeTransform extends Transform {
    transform(item) {
        return item.likeCount;
    }
};
