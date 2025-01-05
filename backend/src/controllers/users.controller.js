const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const userService = require("../services/users.service");

const register = catchAsync(async (req, res) => {
  let userDetail = {};

  const user = await userService.register(req.body);

  userDetail.user = user;
  userDetail.msg = "User created successfully";

  res.status(httpStatus.CREATED).json(userDetail);
});

const login = catchAsync(async (req, res) => {
  let userDetail = {};

  const user = await userService.login(req.body);

  userDetail.user = user;
  userDetail.msg = "User login successfully";

  res.status(httpStatus.OK).json(userDetail);
});

module.exports = {
  login,
  register,
};
