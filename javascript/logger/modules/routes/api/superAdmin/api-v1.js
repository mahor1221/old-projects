const config = require("../../../config");
const express = require("express");
const router = express.Router();

// Middleware
const apiSuperAdmin = require(`${config.path.middleware}/superAdmin/apiSuperAdmin`);
const apiSuperAdminRegister = require(`${config.path.middleware}/superAdmin/apiSuperAdminRegister`);

// Controller
const superAdminController = `${config.path.controller}/api/v1/superAdminController`;

const projectIndexController = require(`${superAdminController}/project/indexController.js`);
const projectSingleController = require(`${superAdminController}/project/singleController.js`);
const projectStoreController = require(`${superAdminController}/project/storeController.js`);

const sectionIndexController = require(`${superAdminController}/section/indexController.js`);
const sectionSingleController = require(`${superAdminController}/section/singleController.js`);
const sectionStoreController = require(`${superAdminController}/section/storeController.js`);

const logIndexController = require(`${superAdminController}/log/indexController.js`);
const logSingleController = require(`${superAdminController}/log/singleController.js`);
const logStoreController = require(`${superAdminController}/log/storeController.js`);

const logDescriptionIndexController = require(`${superAdminController}/logDescription/indexController.js`);
const logDescriptionSingleController = require(`${superAdminController}/logDescription/singleController.js`);
const logDescriptionStoreController = require(`${superAdminController}/logDescription/storeController.js`);

const oAuthRegisterController = require(`${superAdminController}/oAuth/registerController`);
const oAuthLoginController = require(`${superAdminController}/oAuth/loginController`);

const profileSingleController = require(`${superAdminController}/profile/singleController`);
const profileIndexController = require(`${superAdminController}/profile/indexController`);

const tokenIndexController = require(`${superAdminController}/token/indexController`);
const tokenLogoutController = require(`${superAdminController}/token/logoutController`);
const tokenSingleController = require(`${superAdminController}/token/singleController`);

// Router

const projectRouter = express.Router();
projectRouter.get("/", projectIndexController.index.bind(projectIndexController));
projectRouter.get("/:id", projectSingleController.single.bind(projectSingleController));
projectRouter.post("/", projectStoreController.store.bind(projectStoreController));
router.use("/projects", apiSuperAdmin, projectRouter);

const sectionRouter = express.Router();
sectionRouter.get("/", sectionIndexController.index.bind(sectionIndexController));
sectionRouter.get("/:id", sectionSingleController.single.bind(sectionSingleController));
sectionRouter.post("/", sectionStoreController.store.bind(sectionStoreController));
router.use("/sections", apiSuperAdmin, sectionRouter);

const logRouter = express.Router();
logRouter.get("/", logIndexController.index.bind(logIndexController));
logRouter.get("/:id", logSingleController.single.bind(logSingleController));
logRouter.post("/", logStoreController.store.bind(logStoreController));
router.use("/logs", apiSuperAdmin, logRouter);

const logDescriptionRouter = express.Router();
logDescriptionRouter.get("/", logDescriptionIndexController.index.bind(logDescriptionIndexController));
logDescriptionRouter.get("/:id", logDescriptionSingleController.single.bind(logDescriptionSingleController));
logDescriptionRouter.post("/", logDescriptionStoreController.store.bind(logDescriptionStoreController));
router.use("/logDescriptions", apiSuperAdmin, logDescriptionRouter);

const profileRouter = express.Router();
profileRouter.get("/", profileIndexController.index.bind(profileIndexController));
profileRouter.get("/:id", profileSingleController.single.bind(profileSingleController));
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
