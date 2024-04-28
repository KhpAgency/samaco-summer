const express = require("express");
const Router = express.Router();

const { submitForm, getForms } = require("../controllers/formController");

const { protect, allowedTo } = require("../controllers/authController");


Router.post("/submitForm", submitForm);
Router.get("/getforms",protect, getForms);

module.exports = Router;
