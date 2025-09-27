const express = require("express");
const userController = require("../Controllers/UserController");

const Router = express.Router;

Router.route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
Router.route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = Router;
