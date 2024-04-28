const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const usersModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const createToken = require("../utils/createToken");


//----- User Routes -----

exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await usersModel.findById(id);

    if (!user) {
      return next(new ApiError(`No user found for this id:${id}`, 404));
    }

      res.status(200).json({user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});



//----- /User Routes -----
