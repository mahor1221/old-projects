const Transform = require("../../.././transform");

module.exports = class postTransform extends Transform {
    transform(item) {
        return {
            id: item._id,
            compressedImage: item.compressedImage,
            originalImage: item.originalImage,
            likeCount: item.likeCount,
            viewCount: item.viewCount,
            downloadCount: item.downloadCount,
        
        };
    }
};
