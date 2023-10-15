const College = require("../models/College");
const Country = require("../models/Country");

exports.addCollege = async (req, res) => {
  try {
    const college = new College(req.body);
    await college.save();
    res.status(201).json(college);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllColleges = async (req, res) => {
  try {
    // Retrieve the ObjectId for the country based on the country code
    const country = await Country.findById(req.params.id);

    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }

    console.log(country);

    // Use Mongoose to query colleges based on the country ObjectId
    const colleges = await College.find({
      country: country._id, // Use the ObjectId of the country
    }).populate("country"); // Optionally populate the "country" field

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getCollegeDetails = async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate("country");
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCollegeDetails = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json(college);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndRemove(req.params.id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json({ message: "College deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
