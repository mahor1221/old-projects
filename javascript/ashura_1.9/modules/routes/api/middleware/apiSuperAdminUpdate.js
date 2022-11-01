const jwt = require("jsonwebtoken");
const superAdmin = require(`${config.path.model}/superAdmin`);

module.exports = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (token) {
        return jwt.verify(token, config.secret, (err, decode) => {
            if (err) {
                return res.json({
                    success: false,
                    data: "Failed to authenticate token.",
                    status: 403,
                });
            }

            superAdmin.findById(decode.superAdmin_id, (err, superAdmin) => {
                if (err) throw err;

                if (superAdmin) {
                    req.params.id = decode.superAdmin_id;
                    superAdmin.token = token;
                    req.superAdmin = superAdmin;
                    next();
                } else {
                    return res.json({
                        success: false,
                        data: "superAdmin not found",
                        status: 404,
                    });
                }
            });
        });
    }

    return res.status(403).json({
        data: "No Token Provided",
        success: false,
        status: 403,
    });
};
