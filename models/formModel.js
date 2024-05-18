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
      unique: [true, "Email must be unique"],
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: {
      type: String,
      unique: [true, "Phone must be unique"],
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
  },
  { timestamps: true }
);

// formSchema.pre("save", function (next){
//   const defaultValue = "general"
//   if (this.channel ===  null || this.channel === "null" || this.channel === "") {
//     this.channel = defaultValue;
//   }
// })

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
