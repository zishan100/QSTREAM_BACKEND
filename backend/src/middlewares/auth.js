const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

const authenticateJwtToken = (req, res, next) => {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];

  if (!token) {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, "Access Denied: No Token Provided!")
    );
  }

  try {
    const secretKey = config.jwt_secret_token;

    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;

    next();
  } catch (err) {
    return next(new ApiError(httpStatus.FORBIDDEN, "Invalid Token!"));
  }
};

module.exports = authenticateJwtToken;
