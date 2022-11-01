"use strict";
const Transform = require("../.././transform");
const jwt = require("jsonwebtoken");

module.exports = class superAdminTransform extends Transform {
    transform(item, createToken = false) {
        this.createToken = createToken;
        return {
            id: item._id,
            name: item.name,
            email: item.email,
            ...this.withToken(item),
        };
    }

    withToken(item) {
        if (item.token) {
            return { token: item.token };
        }

        if (1) {
            let token = jwt.sign({ superAdmin_id: item._id }, config.secret, {
                expiresIn: "110h",
            });

            return { token };
        }

        return {};
    }
};
