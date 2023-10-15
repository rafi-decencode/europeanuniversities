const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth");
const {
  addCountry,
  getAllCountries,
  getCountryDetails,
  updateCountryDetails,
  deleteCountry,
} = require("../controller/country");

router.post("/addCountry", authUser, addCountry);

router.get("/allCountries", authUser, getAllCountries);

router.get("/countries/:id", authUser, getCountryDetails);

router.put("/countries/:id", authUser, updateCountryDetails);

router.delete("/countries/:id", authUser, deleteCountry);

module.exports = router;
