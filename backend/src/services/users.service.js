const { User } = require("../models/index");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

const generatePayload = (user) => {
  let payload = {
    id: user._id,
    emil: user.email,
  };

  const secretKey = config.jwt_secret_token;

  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

const register = async (body) => {
  try {
    const hashPass = await hashPassword(body.password);

    const createUser = new User({
      ...body,
      email: body.email.trim().toLowerCase(),
      password: hashPass,
    });

    return await createUser.save();
  } catch (err) {
    if (err.code === 11000)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Please choose different email because this email is already used by someone else"
      );

    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  }
};

const login = async (body) => {
  try {
    let user = await User.findOne({
      email: body.email.toLowerCase().trim(),
    })
      .select("_id firstName lastName email password createdAt")
      .exec();

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "No user found");
    }

    const match = await comparePassword(body.password, user.password);

    if (!match) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password not match");
    }

    const token = generatePayload(user);
    delete user.password;

    return { user, token };
  } catch (err) {
    console.log(err);
    throw new ApiError(httpStatus.UNAUTHORIZED, err.message);
  }
};

module.exports = {
  register,
  login,
};
