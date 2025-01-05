const express = require("express");
const validate = require("../../middlewares/validate");
const usersController = require("../../controllers/users.controller");
const usersValidation = require("../../validations/users.validation");

const router = express.Router();

router.post(
  "/register",
  validate(usersValidation.register),
  usersController.register
);
router.post("/login", validate(usersValidation.login), usersController.login);

module.exports = router;
