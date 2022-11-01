const InitializeController = require("./initializeController");
module.exports = new (class likeController extends InitializeController {
  async like(req, res) {
    try {
      req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
      if (this.validation(req, res)) return;
      const episode = await this.model.Episode.findById(req.params.id).exec();
      if (!episode) return this.abort(res, 404, logcode, null, "id");
      await this.model.FavoritesEpisode.create({ episodeId: req.params.id, userId: req.user._id });
      await this.model.Like.create({ episodeId: req.params.id });
      return this.ok(res, logcode, "با موفقیت ثبت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
