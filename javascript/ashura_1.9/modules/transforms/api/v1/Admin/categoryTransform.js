const Transform = require("../../.././transform");

module.exports = class categoryTransform extends Transform {
    transform(item) {
        return {
            id: item._id,
        };
    }
};
