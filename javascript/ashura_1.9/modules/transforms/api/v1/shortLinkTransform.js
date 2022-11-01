const Transform = require("../.././transform");

module.exports = class shortLinkTransform extends Transform {
    transform(item) {
        return {
            id: item._id,
            post: item.post,
            link: item.link,
        };
    }
};
