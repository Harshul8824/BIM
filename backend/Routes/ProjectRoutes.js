const express = require("express");
const ProjectController = require("../Controllers/projectController");

const Router = express.Router();

Router.route("/")
  .get(ProjectController.getAllProjects)
  .post(ProjectController.addProject);
Router.route("/:id")
  .get(ProjectController.getProject)
  .put(ProjectController.updateProject)
  .delete(ProjectController.deleteProject);

module.exports = Router;
