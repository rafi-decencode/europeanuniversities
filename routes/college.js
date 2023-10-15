const express = require("express");
const router = express.Router();
const {
  addCollege,
  getAllColleges,
  getCollegeDetails,
  updateCollegeDetails,
  deleteCollege,
} = require("../controller/college");
const { authUser } = require("../middlewares/auth");

router.post("/addCollege", authUser, addCollege);

router.get("/allColleges/:id", authUser, getAllColleges);

router.get("/College/:id", authUser, getCollegeDetails);

router.put("/College/:id", authUser, updateCollegeDetails);

router.delete("/College/:id", authUser, deleteCollege);

module.exports = router;
