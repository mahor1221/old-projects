const path = require("path");

module.exports = {
  path: {
    helper: path.resolve("./modules/helpers"),
    model: path.resolve("./modules/models"),
    middleware: path.resolve("./modules/routes/middleware"),
    controller: path.resolve("./modules/controllers"),
  },
};
