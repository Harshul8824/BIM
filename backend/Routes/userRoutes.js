const express = require("express");
const userController = require("../Controllers/UserController");

const Router = express.Router();

  console.log("entered1");

Router.route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
Router.route("/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

console.log(userController.addManagerRequest);

Router.route("/req").post(userController.addManagerRequest);
Router.route("/managers").get(userController.getManagers);

module.exports = Router;
