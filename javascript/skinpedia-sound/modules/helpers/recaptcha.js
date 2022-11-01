const axios = require("axios");
const url = process.env.RECAPTCHA_URL;
const secret = process.env.RECAPTCHA_SECRET;
const secretTest = process.env.RECAPTCHA_SECRET_TEST;
const recaptchaTest = process.env.RECAPTCHA_TEST;
module.exports.recaptcha = async (code, ip) => {
  try {
    let key = secretTest;
    if (recaptchaTest == "fasle") key = secret;
    const config = {
      method: "get",
      url: `${url}${key}&response=${code}&remoteip=${ip}`,
      headers: {},
    };
    const response = await axios(config);
    return response;
  } catch (err) {
    console.log(err);
    return false;
  }
};
