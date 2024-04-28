const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const usersModel = require("../models/userModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createToken = require("../utils/createToken");

exports.signup = asyncHandler(async (req, res, next) => {
  // Create a new user
  const user = await usersModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // Generate token and send it to the client side
  const token = createToken(user._id);


  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = createToken(user._id);

  // Send response with user data and token
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  //1) check if token is exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("Please login first to access this route", 401));
  }

  //2) verify token (not changed or expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //3) check if user exists
  const currentUser = await usersModel.findById(decoded.userId);

  if (!currentUser) {
    next(new ApiError("user no longer exists for this token", 401));
  }

  req.user = currentUser;

  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });