const InitializeController = require("./initializeController.js");
module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("name", "نام نمیتواند خالی بماند").notEmpty();
    req.checkBody("projectId", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.validation(req, res)) return;

    try {
      const project = await this.model.Project.findById(req.body.projectId);
      if (!project) return this.abort(res, 404, logcode, null, "projectId");
      let values = { name: req.body.name, projectId: req.body.projectId };
      await this.model.Section.create(values);
      return this.ok(res, logcode, "با موفقیت اضافه شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
