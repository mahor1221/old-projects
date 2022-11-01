"use strict";
const Transform = require("../.././transform");

module.exports = class postTransform extends Transform {
    transform(item) {
        return {
            id: item._id,
            title: item.title,
            description: item.description,
            compressedImage: item.compressedImage,
            originalImage: item.originalImage,
            alt:item.alt,
            likeCount: item.likeCount,
            viewCount: item.viewCount,
            downloadCount: item.downloadCount,
            categories: item.category,
            tags: item.tags,
        };
    }

    showCategories(item) {
        const categoryTransform = require("./categoryTransform");

        if (1) {
            return {
                categories: new categoryTransform().transformCollection(item.category),
            };
        }
        return {};
    }

    withCategories() {
        this.withCategoriesStatus = true;
        return this;
    }
};
