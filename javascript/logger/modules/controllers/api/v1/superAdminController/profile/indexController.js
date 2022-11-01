const InitializeController = require("./initializeController");
module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    try {
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
    let query = {};
    if (req.query.type) {
      try {
        let type = JSON.parse(req.query.type);
        query = { ...query, type: { $in: type } };
      } catch (err) {
        return this.abort(res, 404, logcode, "تایپ وارد شده صحیح نیست", "type");
      }
    }
    const result = await this.helper.index(req, "user", query, [{ $match: query }, { $sort: { _id: -1 } }]);
    if (!result) return this.abort(res, 500, logcode);
    const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
    return this.helper.response(res, null, logcode, 200, Transform);
  }
})();
