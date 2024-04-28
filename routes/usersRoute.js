const express = require("express");
const Router = express.Router();

const {
  getUser,
  getLoggedUser,

} = require("../controllers/usersController");

const {
  protect,
} = require("../controllers/authController");

// applied on all routes
Router.use(protect);

Router.get("/getLoggedUser", getLoggedUser, getUser);

module.exports = Router;
