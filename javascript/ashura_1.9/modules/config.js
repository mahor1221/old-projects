const path = require("path");

module.exports = {
    port: 8080,
    secret: "XutN0ZCmG^8wiEY1Gc0#pAmP*!3sC^Qjwr0YfSV%uhRbBzYEcS",
    path: {
        controllers: {
            api: path.resolve("./modules/controllers/api"),
        },
        model: path.resolve("./modules/models"),
        transform: path.resolve("./modules/transforms"),
        controller: path.resolve("./modules/controllers"),
    },
};
