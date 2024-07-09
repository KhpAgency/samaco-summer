const express = require("express");
const Router = express.Router();

const { submitForm, getForms } = require("../controllers/formControllerV2");

const { protect } = require("../controllers/authController");


Router.post("/submitForm", submitForm);
Router.get("/getforms",protect, getForms);

module.exports = Router;
