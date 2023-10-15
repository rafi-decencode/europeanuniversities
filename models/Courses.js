const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const courseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      text: true,
    },
    college: {
      type: ObjectId,
      ref: "College",
      required: [true, "College reference is required"],
    },
    studyLocation: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: String, required: true },
    studyLanguage: { type: String, required: true },
    awards: { type: String, required: true },
    tuitionFee: { type: String, required: true },
    applicationFee: { type: String, required: true },
    entryQualification: [{ type: String, required: true }],
    entryRequirements: [{ type: String, required: true }],
    languageRequirements: [{ type: String, required: true }],
    otherRequirements: [{ type: String, required: true }],
    courseDeailsFile: [{ type: String }],
    overview: [{ type: String, required: true }],
    careerOpportunity: {
      title: { type: String, required: true },
      items: [{ type: String, required: true }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
