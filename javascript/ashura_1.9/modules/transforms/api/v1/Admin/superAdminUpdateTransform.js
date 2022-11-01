const Transform = require("../../.././transform");

module.exports = class superAdminTransform extends Transform {
    transform(item) {
        return {
            id: item._id,
        };
    }
};
