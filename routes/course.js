const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth");
const {
  addCourse,
  getAllCourses,
  getCourseDetails,
  updateCourseDetails,
  deleteCourse,
} = require("../controller/course");

router.post("/addCourse", authUser, addCourse);

router.get("/allCourses/:id", authUser, getAllCourses);

router.get("/Courses/:id", authUser, getCourseDetails);

router.put("/Courses/:id", authUser, updateCourseDetails);

router.delete("/Courses/:id", authUser, deleteCourse);

module.exports = router;
