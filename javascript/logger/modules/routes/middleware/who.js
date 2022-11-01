const config = require("../../../config");
const User = require(`${config.path.model}/user`);
const Token = require(`${config.path.model}/token`);
const { unauthorized, response } = require(`${config.path.helper}/response`);
const { transform } = require(`${config.path.helper}/transform`);
const itemTransform = ["._id", ".firstName", ".lastName", ".email", ".mobile", ".type"];
module.exports = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.headers["x-access-token"] }).exec();
    if (!token) return unauthorized(res, logcode);
    const user = await User.findById(token.userId).exec();
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
    const Transform = await transform(user, itemTransform);
    return response(res, null, logcode, 200, Transform);
  } catch (err) {
    return unauthorized(res, logcode);
  }
};
