const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expired) => {
  return jwt.sign(payload, "7d", {
    expiresIn: expired,
  });
};
