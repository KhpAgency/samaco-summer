const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const formModel = require("../models/formModel");

exports.submitForm = asyncHandler(async (req, res, next) => {
  try {
    const { channel, chanel } = req.query;
    const { name, email, phone, city, instagram_account } = req.body;

    const existEmail = await formModel.findOne({ email,apiVersion: 'v1' });
    const existPhone = await formModel.findOne({ phone, apiVersion: 'v1' });

    if (existEmail && existPhone) {
      return next(
        new ApiError(
          `Form already exists for the same email: ${email} and phone: ${phone}`,
          400
        )
      );
    }

    if (existEmail) {
      return next(
        new ApiError(`Form already exists for the same email: ${email}`, 400)
      );
    }

    if (existPhone) {
      return next(
        new ApiError(`Form already exists for the same phone: ${phone}`, 400)
      );
    }

    const form = await formModel.create({
      channel: channel == null || channel == "null" ? "instagram" : channel,
      name,
      email,
      phone,
      city,
      instagram_account,
      apiVersion: "v1",
    });

    res.status(200).json({ message: "success", form });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

exports.getForms = asyncHandler(async (req, res, next) => {
  const { channel } = req.query;

  try {
    const query = { apiVersion: "v1" };
    if (channel) {
      query.channel = channel;
    }

    const forms = await formModel.find(query).sort({ createdAt: -1 });

    if (!forms) {
      return next(new ApiError(`No forms found for channel ${channel}`, 404));
    }

    res.status(200).json({ results: forms.length, message: "success", forms });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});
