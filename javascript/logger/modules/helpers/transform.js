const expiresInUser = process.env.EXPIRESIN_USER;
const expiresInSuperAdmin = process.env.EXPIRESIN_SUPER_ADMIN;
const tokenKey = process.env.TOKEN_KEY;
const tokenIv = process.env.TOKEN_IV;
const aesjs = require("aes-js");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");
const TokenModel = require(`${config.path.model}/token`);
module.exports.transform = async (result, item, withPaginate = false, type = null, ip = null, deviceName = null) => {
  if (withPaginate) {
    let items = [];
    for (let index = 0; index < result.docs.length; index++) {
      const element = result.docs[index];
      items.push(itemTransform(element, item));
      if (index === result.docs.length - 1) {
        return { items: items, ...paginateItem(result) };
      }
    }
  } else {
    if (type !== null) {
      const token = await Token(result, type, ip, deviceName);
      return { ...itemTransform(result, item), ...token };
    } else {
      return itemTransform(result, item);
    }
  }

  function itemTransform(result, item) {
    let items = {};
    for (let index = 0; index < item.length; index++) {
      const element = item[index];
      items = { ...items, [element.substring(1)]: eval("result" + element) };
      if (index === item.length - 1) {
        return items;
      }
    }
  }
  async function Token(result, type, ip, deviceName) {
    try {
      const key = JSON.parse(tokenKey);
      const iv = JSON.parse(tokenIv);
      const textBytes = aesjs.utils.utf8.toBytes(uuidv4());
      const aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
      const encryptedBytes = aesOfb.encrypt(textBytes);
      const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
      let values = {};
      if (type === "user") values = { ...values, liveTime: expiresInUser };
      if (type === "superAdmin") values = { ...values, liveTime: expiresInSuperAdmin };
      await TokenModel.create({ ...values, userId: result._id, lastIp: ip, deviceName, token: encryptedHex });
      return { token: encryptedHex };
    } catch (error) {
      console.log(error);
      return { token: null };
    }
  }

  function paginateItem(result) {
    return {
      total: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      pagingCounter: result.pagingCounter,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
    };
  }
};
