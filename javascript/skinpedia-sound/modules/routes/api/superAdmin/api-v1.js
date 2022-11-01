const config = require("../../../config");
const express = require("express");
const router = express.Router();

// Middleware
const apiSuperAdmin = require(`${config.path.middleware}/admin/apiSuperAdmin`);
const apiSuperAdminRegister = require(`${config.path.middleware}/admin/apiSuperAdminRegister`);

// Controller
const superAdminController = `${config.path.controller}/api/v1/superAdminController`;

const oAuthRegisterController = require(`${superAdminController}/oAuth/registerController`);
const oAuthLoginController = require(`${superAdminController}/oAuth/loginController`);

const profileDestroyController = require(`${superAdminController}/profile/destroyController`);
const profileSingleController = require(`${superAdminController}/profile/singleController`);
const profileUpdateController = require(`${superAdminController}/profile/updateController`);
const profileIndexController = require(`${superAdminController}/profile/indexController`);

const tokenIndexController = require(`${superAdminController}/token/indexController`);
const tokenLogoutController = require(`${superAdminController}/token/logoutController`);
const tokenSingleController = require(`${superAdminController}/token/singleController`);

// Router
const profileRouter = express.Router();
profileRouter.get("/", profileIndexController.index.bind(profileIndexController));
profileRouter.get("/:id", profileSingleController.single.bind(profileSingleController));
profileRouter.put("/:id", profileUpdateController.update.bind(profileUpdateController));
profileRouter.delete("/:id", profileDestroyController.destroy.bind(profileDestroyController));
router.use("/profile", apiSuperAdmin, profileRouter);

const tokenRouter = express.Router();
tokenRouter.get("/", tokenIndexController.index.bind(tokenIndexController));
tokenRouter.get("/:id", tokenSingleController.single.bind(tokenSingleController));
tokenRouter.delete("/:id", tokenLogoutController.logout.bind(tokenLogoutController));
router.use("/session", apiSuperAdmin, tokenRouter);

const oAuthRouter = express.Router();
oAuthRouter.post("/register", apiSuperAdminRegister, oAuthRegisterController.register.bind(oAuthRegisterController));
oAuthRouter.post("/login", oAuthLoginController.login.bind(oAuthLoginController));
router.use("/oAuth", oAuthRouter);

module.exports = router;
