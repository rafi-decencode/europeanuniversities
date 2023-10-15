const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const collegeSchema = mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      text: true,
    },
    country: {
      type: ObjectId,
      ref: "Country",
      required: [true, "Country reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("College", collegeSchema);
