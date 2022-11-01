const Transform = require("../../.././transform");

module.exports = class adminTransform extends Transform {
    transform(item) {
        return {
            id: item._id,
        };
    }
};
