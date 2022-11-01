const config = require("../../../config");
const User = require(`${config.path.model}/user`);
const Token = require(`${config.path.model}/token`);
const { unauthorized } = require(`${config.path.helper}/response`);

module.exports = async (req, res, next) => {
  try {
    const token = await Token.findOne({ token: req.headers["x-access-token"] }).exec();
    if (!token) return unauthorized(res, logcode);
    const user = await User.findOne({ _id: token.userId, type: "superAdmin" }).exec();
    if (!user) return unauthorized(res, logcode);
    const date = Date.parse(new Date());
    const dateToken = Date.parse(token.createdAt);
    if (token.liveTime * 60000 + dateToken < date) {
      await Token.findByIdAndRemove(token._id).exec();
      return unauthorized(res, logcode);
    }
    let value = {};
    if (token.lastIp != req.connection.remoteAddress) value = { ...value, lastIp: req.connection.remoteAddress };
    await Token.findByIdAndUpdate(token._id, value).exec();
    req.user = user;
    next();
  } catch (err) {
    return unauthorized(res, logcode);
  }
};
