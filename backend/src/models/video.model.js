const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
  {
    videoLink: {
      type: String,
      trim: true,
    },
    previewImage: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    contentRating: {
      type: String,
      required: true,
      trim: true,
    },
    releaseDate: {
      type: String,
      required: true,
      trim: true,
    },
    votes: {
      upVotes: {
        type: Number,
        default: 0,
      },
      downVotes: {
        type: Number,
        default: 0,
      },
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
  }
);

/**
 * @typedef Video
 */
const Video = mongoose.model("Video", videoSchema);

module.exports.Video = Video;
module.exports.videoSchema = videoSchema;
