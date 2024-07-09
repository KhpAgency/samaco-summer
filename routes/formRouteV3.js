const express = require("express");
const Router = express.Router();

const { submitForm, getForms } = require("../controllers/formControllerV3");

const { protect } = require("../controllers/authController");


Router.post("/submitForm", submitForm);
Router.get("/getforms",protect, getForms);

module.exports = Router;
