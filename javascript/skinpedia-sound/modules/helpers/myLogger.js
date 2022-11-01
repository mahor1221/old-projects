var axios = require("axios");
const myLoggerToken = process.env.MY_LOGGER_TOKEN;
const myLoggerSite = process.env.MY_LOGGER_SITE;
const myLoggerUrl = process.env.MY_LOGGER_URL;
module.exports = async (req, res, next) => {
  if (req.get("User-Agent") == "netnegar") {
    logcode = "netnegar";
    next();
  } else {
    try {
      const data = JSON.stringify({
        token: myLoggerToken,
        site: myLoggerSite,
        section: "podcast-api",
        data: `{"url":"${req.originalUrl}", "header":"${req.rawHeaders}", "body":"${JSON.stringify(req.body)}"}`,
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      });
      const config = {
        method: "post",
        url: myLoggerUrl,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      const response = await axios(config);
      logcode = response.data.logcode;
      next();
    } catch (err) {
      console.log(err);
      next();
    }
  }
};
