const registerSuperAdminToken = process.env.REGISTER_SUPER_ADMIN_TOKEN;
const config = require("../../../config");
const { unauthorized } = require(`${config.path.helper}/response`);

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token === registerSuperAdminToken) next();
  else {
    return unauthorized(res, logcode);
  }
};
