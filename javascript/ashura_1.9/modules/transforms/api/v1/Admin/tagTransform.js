const Transform = require("../../.././transform");

module.exports = class tagTransform extends Transform {
    transform(item) {
        return {
            id: item._id,
        };
    }
};
