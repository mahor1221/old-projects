const jwt = require("jsonwebtoken");
const superAdmin = require(`${config.path.model}/superAdmin`);

module.exports = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if ((token = "XutN0ZCmG^8wiEY1Gc0#pAmP*!3sC^Qjwr0YfSV%uhRbBzYEcS")) {
        next();
        return;
    }

    return res.status(403).json({
        data: "No Token Provided",
        success: false,
        status: 403,
    });
};
