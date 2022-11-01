const Transform = require("../.././transform");

module.exports = class likeTransform extends Transform {
    transform(item) {
        return {
            Count : item.Count ,
            createdAt :item.createdAt
        };
    }
};
