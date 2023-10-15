const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validateUsername } = require("../helpers/validation");
const { generateToken } = require("../helpers/token");
const verify = require("../helpers/otpVerify");
const { store } = require("../helpers/multer");
const cloudinary = require("cloudinary");
const fs = require("fs");
const path = require("path");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, password, isAdmin } = req.body;

    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);
    const cryptedPassword = await bcrypt.hash(password, 12);

    const user = await new User({
      first_name,
      last_name,
      email,
      phone,
      password: cryptedPassword,
      username: newUsername,
      isAdmin,
    }).save();

    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      isAdmin: user.isAdmin,
      message: "Register Success !",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { phone: email }],
    });

    if (!user) {
      return res.status(400).json({
        message: "the phone number you entered is not connected to an account.",
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials.Please try again.",
      });
    }
    console.log("token");
    const token = generateToken({ id: user._id.toString() }, "7d");
    console.log(token);
    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;
    const id = req.params.id;

    const updatedProfile = await User.findByIdAndUpdate(id, {
      first_name,
      last_name,
      email,
      phone,
    });

    res.status(200).json({ updatedProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFund = async (req, res) => {
  try {
    const id = req.params.id;
    const { amount } = req.body;
    const user = await User.findById(id);
    const addFund = await User.findByIdAndUpdate(id, {
      accountBalance: Number(user.accountBalance) + Number(amount),
    });

    let newTransaction = await User.updateOne(
      { _id: id },
      { $push: { transactions: { transactionType: "addfund", amount } } }
    );
    const users = await User.findById(id);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.withdrawFund = async (req, res) => {
  try {
    const id = req.params.id;
    const { amount } = req.body;
    const user = await User.findById(id);
    const addFund = await User.findByIdAndUpdate(id, {
      accountBalance: Number(user.accountBalance) - Number(amount),
    });

    let newTransaction = await User.updateOne(
      { _id: id },
      { $push: { transactions: { transactionType: "withdrawFund", amount } } }
    );
    const users = await User.findById(id);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  // try {
  //     const {phoneNumber} = req.body
  //     const user = await User.findOne({ phone:phoneNumber });
  //     return res.status(200).json({
  //       message:
  //         "Reset password request successfully placed",
  //     });
  //   if (!user) {
  //     return res.status(400).json({
  //       message:
  //         "the Phone number you entered is not connected to any account.",
  //     });
  //   }
  //     const data=  await verify.doSms({ phoneNumber });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
};

exports.verifyOtp = async (req, res) => {
  // try {
  //     const{phoneNumber, otp}= req.body
  //     const data = await verify.otpVerify({ otp }, { phoneNumber });
  //     if(data.valid){
  //       return res.status(200).json({
  //         message:
  //           "Correct OTP",
  //       });
  //     }
  //     return res.status(422).json({
  //       message:
  //         "Incorrect OTP",
  //     });
  // } catch (error) {
  //     res.status(500).json({ message: error.message });
  // }
};
exports.updatePassword = async (req, res) => {
  // try {
  //     const{phoneNumber, password}= req.body
  //     const cryptedPassword = await bcrypt.hash(password, 12);
  //     const user = await User.updateOne({phone: phoneNumber }, { $set: { password: cryptedPassword }});
  //     return res.status(200).json({
  //       message:
  //         "Password Updated",
  //     });
  // } catch (error) {
  //     res.status(500).json({ message: error.message });
  // }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAskGoldSpread = async (req, res) => {
  try {
    const { spread } = req.body;
    const id = req.user.id;
    const addspread = await User.findByIdAndUpdate(id, {
      goldAskSpread: spread,
    });

    res.status(200).json({ message: `success` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addBidGoldSpread = async (req, res) => {
  try {
    const { spread } = req.body;
    const id = req.user.id;
    const addspread = await User.findByIdAndUpdate(id, {
      goldBidSpread: spread,
    });

    res.status(200).json({ message: `success` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addAskSilverSpread = async (req, res) => {
  try {
    const { spread } = req.body;
    const id = req.user.id;
    const addspread = await User.findByIdAndUpdate(id, {
      silverAskSpread: spread,
    });

    res.status(200).json({ message: `success` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addBidSilverSpread = async (req, res) => {
  try {
    const { spread } = req.body;
    const id = req.user.id;
    const addspread = await User.findByIdAndUpdate(id, {
      silverBidSpread: spread,
    });

    res.status(200).json({ message: `success` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getSpread = async (req, res) => {
  try {
    const user = await User.findOne({ isAdmin: true });
    res.status(200).json({
      goldAskSpread: user.goldAskSpread,
      goldBidSpread: user.goldBidSpread,
      silverAskSpread: user.silverAskSpread,
      silverBidSpread: user.silverBidSpread,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bidOrBuy = async (req, res) => {
  try {
    const { option } = req.body;
    const id = req.user.id;
    const addspread = await User.findByIdAndUpdate(id, {
      option: option,
    });

    res.status(200).json({ message: `success` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getBidOrBuy = async (req, res) => {
  try {
    const user = await User.findOne({ isAdmin: true });
    res.status(200).json({ option: user.option });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.mediaImage = async (req, res) => {
  try {
    store.array("files");
    console.log(req.files); // The uploaded images are stored in req.files
    res.status(200).json({ sucess: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.storeImageUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const id = req.user.id;
    const addimage = await User.findByIdAndUpdate(id, {
      $push: { mediaUrl: { url } },
    });

    res.status(200).json({ message: `success` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.imageList = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    res.status(200).json(user.mediaUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMediaImage = async (req, res) => {
  try {
    const id = req.user.id;
    var imageId = mongoose.Types.ObjectId(req.params.id);
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $pull: { mediaUrl: { _id: imageId } } }
    );
    res.status(200).json("Success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/****Cloudinary Image   ***** */

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.uploadImages = async (req, res) => {
  try {
    const { path } = req.body;
    let files = Object.values(req.files).flat();
    let images = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file, path);
      images.push(url);
      removeTmp(file.tempFilePath);
    }
    res.json(images);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: path,
      },
      (err, res) => {
        if (err) {
          removeTmp(file.tempFilePath);
          return res.status(400).json({ message: "Upload image failed." });
        }
        resolve({
          url: res.secure_url,
        });
      }
    );
  });
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
