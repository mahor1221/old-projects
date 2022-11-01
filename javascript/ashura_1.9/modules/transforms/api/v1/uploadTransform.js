"use strict";
const Transform = require("../.././transform");

module.exports = class uploadTransform extends Transform {
    transform(item) {
        return {
            link: item.link,
            createdAt: item.createdAt
        };
    }

   
};
