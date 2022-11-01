const config = require("../../../config");
const express = require("express");
const router = express.Router();
// Middleware
const apiUser = require(`${config.path.middleware}/user/apiUser`);

// Controller
const userController = `${config.path.controller}/api/v1/userController`;

const playListStoreController = require(`${userController}/playList/storeController`);
const playListDestroyController = require(`${userController}/playList/destroyController`);
const playListUpdateController = require(`${userController}/playList/updateController`);
const playListIndexController = require(`${userController}/playList/indexController`);
const playListSingleController = require(`${userController}/playList/singleController`);

const episodeDisLikeController = require(`${userController}/episode/disLikeController`);
const episodeDownloadController = require(`${userController}/episode/downloadController`);
const episodeLikeController = require(`${userController}/episode/likeController`);

const oAuthRegisterController = require(`${userController}/oAuth/registerController`);
const oAuthLoginController = require(`${userController}/oAuth/loginController`);

const profileDestroyController = require(`${userController}/profile/destroyController`);
const profileSingleController = require(`${userController}/profile/singleController`);
const profileUpdateController = require(`${userController}/profile/updateController`);

const tokenIndexController = require(`${userController}/token/indexController`);
const tokenLogoutController = require(`${userController}/token/logoutController`);
const tokenSingleController = require(`${userController}/token/singleController`);

// Router
const playListRouter = express.Router();
playListRouter.get("/", playListIndexController.index.bind(playListIndexController));
playListRouter.post("/", playListStoreController.store.bind(playListStoreController));
playListRouter.get("/:id", playListSingleController.single.bind(playListSingleController));
playListRouter.put("/:id", playListUpdateController.update.bind(playListUpdateController));
playListRouter.delete("/:id", playListDestroyController.destroy.bind(playListDestroyController));
router.use("/playLists", apiUser, playListRouter);

const episodeRouter = express.Router();
episodeRouter.post("/episodes/like/:id", apiUser, episodeLikeController.like.bind(episodeLikeController));
episodeRouter.post("/episodes/disLike/:id", apiUser, episodeDisLikeController.disLike.bind(episodeDisLikeController));
episodeRouter.post("/episodes/download/:id", apiUser, episodeDownloadController.download.bind(episodeDownloadController));
router.use("/", episodeRouter);

const profileRouter = express.Router();
profileRouter.get("/", profileSingleController.single.bind(profileSingleController));
profileRouter.put("/", profileUpdateController.update.bind(profileUpdateController));
profileRouter.delete("/", profileDestroyController.destroy.bind(profileDestroyController));
router.use("/profile", apiUser, profileRouter);

const tokenRouter = express.Router();
tokenRouter.get("/", tokenIndexController.index.bind(tokenIndexController));
tokenRouter.get("/:id", tokenSingleController.single.bind(tokenSingleController));
tokenRouter.delete("/:id", tokenLogoutController.logout.bind(tokenLogoutController));
router.use("/session", apiUser, tokenRouter);

const oAuthRouter = express.Router();
oAuthRouter.post("/register", oAuthRegisterController.register.bind(oAuthRegisterController));
oAuthRouter.post("/login", oAuthLoginController.login.bind(oAuthLoginController));
router.use("/oAuth", oAuthRouter);

module.exports = router;
