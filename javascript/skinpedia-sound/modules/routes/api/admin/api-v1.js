const config = require("../../../config");
const express = require("express");
const router = express.Router();
// Middleware
const apiAdmin = require(`${config.path.middleware}/admin/apiAdmin`);
const apiSuperAdmin = require(`${config.path.middleware}/admin/apiSuperAdmin`);

// Controller
const adminController = `${config.path.controller}/api/v1/adminController`;

const categoryStoreController = require(`${adminController}/category/storeController`);
const categoryDestroyController = require(`${adminController}/category/destroyController`);
const categoryUpdateController = require(`${adminController}/category/updateController`);

const episodeStoreController = require(`${adminController}/episode/storeController`);
const episodeDestroyController = require(`${adminController}/episode/destroyController`);
const episodeUpdateController = require(`${adminController}/episode/updateController`);

const statisticsDonwloadController = require(`${adminController}/statistics/donwloadController`);
const statisticsDisLikeController = require(`${adminController}/statistics/disLikeController`);
const statisticsLikeController = require(`${adminController}/statistics/likeController`);
const statisticsViewController = require(`${adminController}/statistics/viewController`);

const oAuthRegisterController = require(`${adminController}/oAuth/registerController`);
const oAuthLoginController = require(`${adminController}/oAuth/loginController`);

const profileDestroyController = require(`${adminController}/profile/destroyController`);
const profileSingleController = require(`${adminController}/profile/singleController`);
const profileUpdateController = require(`${adminController}/profile/updateController`);

const tokenIndexController = require(`${adminController}/token/indexController`);
const tokenLogoutController = require(`${adminController}/token/logoutController`);
const tokenSingleController = require(`${adminController}/token/singleController`);

// Router
const episodeRouter = express.Router();
episodeRouter.post("/", episodeStoreController.store.bind(episodeStoreController));
episodeRouter.put("/:id", episodeUpdateController.update.bind(episodeUpdateController));
episodeRouter.delete("/:id", episodeDestroyController.destroy.bind(episodeDestroyController));
router.use("/episodes", apiAdmin, episodeRouter);

const categoryRouter = express.Router();
categoryRouter.post("/", categoryStoreController.store.bind(categoryStoreController));
categoryRouter.put("/:id", categoryUpdateController.update.bind(categoryUpdateController));
categoryRouter.delete("/:id", categoryDestroyController.destroy.bind(categoryDestroyController));
router.use("/categories", apiAdmin, categoryRouter);

const statisticsRouter = express.Router();
statisticsRouter.get("/like/month", statisticsLikeController.like.bind(statisticsLikeController));
statisticsRouter.get("/disLike/month", statisticsDisLikeController.disLike.bind(statisticsDisLikeController));
statisticsRouter.get("/download/month", statisticsDonwloadController.download.bind(statisticsDonwloadController));
statisticsRouter.get("/view/month", statisticsViewController.view.bind(statisticsViewController));
router.use("/statistics", apiAdmin, statisticsRouter);

const profileRouter = express.Router();
profileRouter.get("/:id", profileSingleController.single.bind(profileSingleController));
profileRouter.put("/:id", profileUpdateController.update.bind(profileUpdateController));
profileRouter.delete("/:id", profileDestroyController.destroy.bind(profileDestroyController));
router.use("/profile", apiAdmin, profileRouter);

const tokenRouter = express.Router();
tokenRouter.get("/", tokenIndexController.index.bind(tokenIndexController));
tokenRouter.get("/:id", tokenSingleController.single.bind(tokenSingleController));
tokenRouter.delete("/:id", tokenLogoutController.logout.bind(tokenLogoutController));
router.use("/session", apiAdmin, tokenRouter);

const oAuthRouter = express.Router();
oAuthRouter.post("/register", apiSuperAdmin, oAuthRegisterController.register.bind(oAuthRegisterController));
oAuthRouter.post("/login", oAuthLoginController.login.bind(oAuthLoginController));
router.use("/oAuth", oAuthRouter);

module.exports = router;
