const express = require("express");

const videoRoute = require("./video.route");
const usersRoute = require("./users.route");

const router = express.Router();

router.use("/videos", videoRoute);
router.use("/auth", usersRoute);

module.exports = router;
