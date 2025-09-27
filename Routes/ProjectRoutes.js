const express = require("express");
const ProjectController = require("../Controllers/projectController");

const Router = express.Router();

Router.route("/")
  .get(ProjectController.getAllProjects)
  .post(ProjectController.addProject);
Router.route("/:id")
  .get(ProjectController.getProject)
  .delete(ProjectController.deleteProject);

module.exports = Router;
