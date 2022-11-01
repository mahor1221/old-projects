const config = require("../../../config");
const express = require("express");
const router = express.Router();

// Controller
const publicController = `${config.path.controller}/api/v1/publicController`;

const episodeIndexController = require(`${publicController}/episode/indexController`);
const episodeSingleController = require(`${publicController}/episode/singleController`);
const episodeByCategoryController = require(`${publicController}/episode/byCategoryController`);
const episodeSurroundingIdsController = require(`${publicController}/episode/surroundingIdsController`);

const categoryIndexController = require(`${publicController}/category/indexController`);
const categorySingleController = require(`${publicController}/category/singleController`);

// Router
const episodeRouter = express.Router();
episodeRouter.get("/", episodeIndexController.index.bind(episodeIndexController));
episodeRouter.get("/:id", episodeSingleController.single.bind(episodeSingleController));
episodeRouter.get("/:id/surrounding", episodeSurroundingIdsController.surroundingIds.bind(episodeSurroundingIdsController));
episodeRouter.get("/categories/:id", episodeByCategoryController.byCategory.bind(episodeByCategoryController));
router.use("/episodes", episodeRouter);

const categoryRouter = express.Router();
categoryRouter.get("/", categoryIndexController.index.bind(categoryIndexController));
categoryRouter.get("/:id", categorySingleController.single.bind(categorySingleController));
router.use("/categories", categoryRouter);

module.exports = router;
