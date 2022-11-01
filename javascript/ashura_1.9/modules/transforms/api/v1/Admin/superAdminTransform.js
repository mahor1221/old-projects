"use strict";
const Transform = require("../../../transform");
const jwt = require("jsonwebtoken");

module.exports = class adminTransform extends Transform {
    transform(item, createToken = false) {
        this.createToken = createToken;
        return {
            id: item._id,
            name: item.name,
            email: item.email,
        };
    }
};
