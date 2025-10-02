const express = require("express");
const progressController = require("../Controllers/progressController");

const Router = express.Router();

Router.route("/")
  .get(progressController.getAllProgress)
  .post(progressController.addProgress);

Router.route("/project/:projectId")
  .get(progressController.getProgressByProject);

Router.route("/:id")
  .get(progressController.getProgress)
  .put(progressController.updateProgress)
  .delete(progressController.deleteProgress);

module.exports = Router;
