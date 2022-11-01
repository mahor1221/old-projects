const express = require("express");
const router = express.Router();

// middleware
const apiAdmin = require("./middleware/apiAdmin");
const apiSuperAdmin = require("./middleware/apiSuperAdmin");
const apiAdminUpdate = require("./middleware/apiAdminUpdate");
const apiSuperAdminUpdate = require("./middleware/apiSuperAdminUpdate");
const apiSuperAdminRegister = require("./middleware/apiSuperAdminRegister");

//  Controllers
const { api: ControllerApi } = config.path.controllers;

// AdminController
const AdminPostController = require(`${ControllerApi}/v1/Admin/postController`);
const AdminCategoryController = require(`${ControllerApi}/v1/Admin/categoryController`);
const AdminTagController = require(`${ControllerApi}/v1/Admin/tagController`);
const AdminAdminController = require(`${ControllerApi}/v1/Admin/adminController`);
const AdminSuperAdminController = require(`${ControllerApi}/v1/Admin/superAdminController`);
const AdminShortLinkController = require(`${ControllerApi}/v1/Admin/shortLinkController`);
const { uploadImage } = require('./middleware/apiUploadImage');

// HomeController
const HomePostController = require(`${ControllerApi}/v1/postController`);
const HomeCategoryController = require(`${ControllerApi}/v1/categoryController`);
const HomeTagController = require(`${ControllerApi}/v1/tagController`);
const HomeAdminController = require(`${ControllerApi}/v1/adminController`);
const HomeShortLinkController = require(`${ControllerApi}/v1/shortLinkController`);

// HomePostRouter
const homePostRouter = express.Router();
homePostRouter.get("/posts", HomePostController.index.bind(HomePostController));
homePostRouter.get("/posts/:id", HomePostController.single.bind(HomePostController));
homePostRouter.get("/posts/:id/surrounding", HomePostController.SurroundingIds.bind(HomePostController));
homePostRouter.get("/posts/categories/:id", HomePostController.byCategory.bind(HomePostController));
homePostRouter.get("/posts/categories/:id/tags", HomePostController.tagsByCategory.bind(HomePostController));
homePostRouter.get("/posts/tags/:id", HomePostController.byTag.bind(HomePostController));
homePostRouter.get("/trending/posts/", HomePostController.trend.bind(HomePostController));

homePostRouter.post("/posts/like/:id", HomePostController.like.bind(HomePostController));
homePostRouter.post("/posts/disLike/:id", HomePostController.disLike.bind(HomePostController));
homePostRouter.post("/posts/view/:id", HomePostController.view.bind(HomePostController));
homePostRouter.post("/posts/download/:id", HomePostController.download.bind(HomePostController));
//
// homePostRouter.get("/posts/statistics/all/like",apiAdmin ,HomePostController.statisticsLikeAll.bind(HomePostController));
// homePostRouter.get("/posts/statistics/byPostId/like/:id",apiAdmin ,HomePostController.statisticsLikeByPostId.bind(HomePostController));
// homePostRouter.get("/posts/statistics/all/disLike/",apiAdmin ,HomePostController.statisticsDisLikeAll.bind(HomePostController));
// homePostRouter.get("/posts/statistics/byPostId/disLike/:id",apiAdmin ,HomePostController.statisticsDisLikeByPostId.bind(HomePostController));
// homePostRouter.get("/posts/statistics/all/download/",apiAdmin ,HomePostController.statisticsDownloadAll.bind(HomePostController));
// homePostRouter.get("/posts/statistics/byPostId/download/:id",apiAdmin ,HomePostController.statisticsDownloadByPostId.bind(HomePostController));
// 
// homePostRouter.get("/posts/statistics/all/like/month",HomePostController.statisticsLikeAll.bind(HomePostController));

// 
homePostRouter.post("/posts/upload/image",apiAdmin,uploadImage.single('image') ,HomePostController.uploadImage.bind(HomePostController));
homePostRouter.get("/getAll/image",HomePostController.getUploadImage.bind(HomePostController));








router.use("/v1", homePostRouter);

// HomeCategoryRouter
const homeCategoryRouter = express.Router();
homeCategoryRouter.get("/categories", HomeCategoryController.index.bind(HomeCategoryController));
homeCategoryRouter.get("/categories/:id", HomeCategoryController.single.bind(HomeCategoryController));
router.use("/v1", homeCategoryRouter);

// HomeTagRouter
const homeTagRouter = express.Router();
homeTagRouter.get("/tags", HomeTagController.index.bind(HomeTagController));
homeTagRouter.get("/tags/:id", HomeTagController.single.bind(HomeTagController));
homeTagRouter.get("/trending/tags", HomeTagController.trend.bind(HomeTagController));
router.use("/v1", homeTagRouter);

// HomeShortLinkRouter
const homeShortLinkRouter = express.Router();
homeShortLinkRouter.get("/shortLinks", HomeShortLinkController.index.bind(HomeShortLinkController));
homeShortLinkRouter.get("/shortLinks/:id", HomeShortLinkController.single.bind(HomeShortLinkController));
homeShortLinkRouter.get("/shortLinks/shorten/:id", HomeShortLinkController.shorten.bind(HomeShortLinkController));
homeShortLinkRouter.get("/shortLinks/elongate/:link", HomeShortLinkController.elongate.bind(HomeShortLinkController));
router.use("/v1", homeShortLinkRouter);

// HomeAdminController
const homeAdminRouter = express.Router();
homeAdminRouter.post("/login", HomeAdminController.login.bind(HomeAdminController));
router.use("/v1/admin", homeAdminRouter);

// adminPostRouter
const adminPostRouter = express.Router();
adminPostRouter.post("/posts",apiAdmin,AdminPostController.store.bind(AdminPostController));
adminPostRouter.put("/posts/:id",apiAdmin ,AdminPostController.update.bind(AdminPostController));
adminPostRouter.delete("/posts/:id", apiAdmin, AdminPostController.destroy.bind(AdminPostController));
router.use("/v1/admin", adminPostRouter);

// adminCategoryRouter
const adminCategoryRouter = express.Router();
adminCategoryRouter.post("/categories", apiAdmin, AdminCategoryController.store.bind(AdminCategoryController));
adminCategoryRouter.put("/categories/:id", apiAdmin, AdminCategoryController.update.bind(AdminCategoryController));
adminCategoryRouter.delete("/categories/:id", apiAdmin, AdminCategoryController.destroy.bind(AdminCategoryController));
router.use("/v1/admin", adminCategoryRouter);

// adminTagRouter
const adminTagRouter = express.Router();
adminTagRouter.post("/tags",apiAdmin,AdminTagController.store.bind(AdminTagController));
adminTagRouter.put("/tags/:id",apiAdmin,AdminTagController.update.bind(AdminTagController));
adminTagRouter.delete("/tags/:id", apiAdmin, AdminTagController.destroy.bind(AdminTagController));
router.use("/v1/admin", adminTagRouter);

// admin ShortLink Router
const adminShotLinkRouter = express.Router();
// adminShotLinkRouter.post("/shortLinks", apiAdmin, AdminShortLinkController.store.bind(AdminShortLinkController));
// adminShotLinkRouter.put("/shortLinks/:id", apiAdmin, AdminShortLinkController.update.bind(AdminShortLinkController));
adminShotLinkRouter.delete("/shortLinks/:id", apiAdmin, AdminShortLinkController.destroy.bind(AdminShortLinkController));
router.use("/v1/admin", adminShotLinkRouter);

// adminSuperAdminRouter
const adminSuperAdminRouter = express.Router();
adminSuperAdminRouter.get("/register/:id",apiSuperAdmin ,AdminSuperAdminController.single.bind(AdminSuperAdminController));
adminSuperAdminRouter.post("/register", apiSuperAdminRegister, AdminSuperAdminController.register.bind(AdminSuperAdminController));
adminSuperAdminRouter.post("/login", AdminSuperAdminController.login.bind(AdminSuperAdminController));
adminSuperAdminRouter.put("/register/:id", apiSuperAdminUpdate, AdminSuperAdminController.update.bind(AdminSuperAdminController));
router.use("/v1/superAdmin", adminSuperAdminRouter);

// adminAdminRouter
const adminAdminRouter = express.Router();
adminAdminRouter.get("/register",apiSuperAdmin ,AdminAdminController.index.bind(AdminAdminController));
adminAdminRouter.get("/register/:id", apiAdminUpdate, AdminAdminController.single.bind(AdminAdminController));
adminAdminRouter.post("/register",apiSuperAdmin ,AdminAdminController.register.bind(AdminAdminController));
adminAdminRouter.put("/register/:id", apiAdminUpdate, AdminAdminController.update.bind(AdminAdminController));
adminAdminRouter.delete("/register/:id", apiSuperAdmin, AdminAdminController.destroy.bind(AdminAdminController));
router.use("/v1/admin", adminAdminRouter);

module.exports = router;
