const mongoose = require("mongoose");
const moment = require("moment-timezone");

const formSchema = mongoose.Schema(
  {
    channel: {
        type: String,
        default: "general"
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    instagram_account: {
      type: String,
      required: [true, "instagram account is required"],
    },
    apiVersion: {
      type: String,
    },
  },
  { timestamps: true }
);

formSchema.pre("save", function (next) {
  const currentTime = moment()
    .tz("Africa/Cairo")
    .format("YYYY-MM-DDTHH:mm:ss[Z]");

  this.createdAt = currentTime;
  this.updatedAt = currentTime;

  next();
});

formSchema.pre("findOneAndUpdate", function () {
  this.updateOne(
    {},
    {
      $set: {
        updatedAt: moment().tz("Africa/Cairo").format("YYYY-MM-DDTHH:mm:ss[Z]"),
      },
    }
  );
});

const form = mongoose.model("Form", formSchema);
module.exports = form;
