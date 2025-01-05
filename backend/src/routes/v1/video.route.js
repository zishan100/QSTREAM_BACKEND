const express = require("express");
const videoController = require("../../controllers/video.controller");
const validate = require("../../middlewares/validate");
const videoValidation = require("../../validations/video.validation");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  auth,
  validate(videoValidation.videoPost),
  videoController.videoPost
);

router.get("/", validate(videoValidation.getVideo), videoController.getVideo);

router.get(
  "/:id",
  validate(videoValidation.getVideo),
  videoController.getVideoById
);

router.patch(
  "/:id/votes",
  validate(videoValidation.patchVotes),
  videoController.patchVotes
);

router.patch(
  "/:id/views",
  validate(videoValidation.patchViews),
  videoController.patchViews
);

router.patch("/:id/video_webhooks", videoController.videoWebHooks);

module.exports = router;
