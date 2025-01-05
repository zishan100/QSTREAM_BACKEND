const { Video } = require("../models/index");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Types } = require("mongoose");

const sortByviewCount = (a, b) => {
  if (a.viewCount > b.viewCount) return -1;
  if (a.viewCount === b.viewCount) {
    const d1 = new Date(a.releaseDate);
    const d2 = new Date(b.releaseDate);

    if (d1 > d2) return -1;
    if (d1 < d2) return 1;

    return 0;
  }
  return 1;
};

const sortByReleaseDate = (a, b) => {
  const d1 = new Date(a.releaseDate);
  const d2 = new Date(b.releaseDate);

  if (d1 > d2) return -1;

  return 1;
};

const videoPost = async (body) => {
  let { title, genre, contentRating, releaseDate } = body;

  if (title && genre && contentRating && releaseDate) {
    const createVideo = new Video({
      ...body,
    });

    return await createVideo.save();
  }

  throw new ApiError(httpStatus.BAD_REQUEST, "Some body parameter is missing");
};

const getVideoById = async (id) => {
  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
  }

  return video;
};

const getVideoByFilter = async (filter) => {
  let filterObj = {};

  if (filter.title) {
    filterObj.title = { $regex: new RegExp(filter.title, "i") };
  }

  if (filter.genres) {
    let filterGenres = filter.genres.split(",");

    if (!filterGenres.includes("All")) {
      let arrOfGenres = [];

      for (const genres of filterGenres) {
        arrOfGenres.push(new RegExp(genres, "i"));
      }

      filterObj.genre = { $in: arrOfGenres };
    }
  }

  if (filter.contentRating) {
    const ratingArr = ["Anyone", "7+", "12+", "16+", "18+"];

    const idx = ratingArr.findIndex((items) => items == filter.contentRating);

    // const filterRating =

    filterObj.contentRating = { $in: ratingArr.slice(idx) };
  }

  // console.log(filterObj);

  let video;

  video = await Video.find(filterObj);

  if (filter.sortBy === "viewCount") {
    video.sort(sortByviewCount);
  } else {
    video.sort(sortByReleaseDate);
  }

  return { videos: video };
};

const patchVotes = async (id, body) => {
  const { vote, change } = body;

  let video = await Video.findById(id);

  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
  }

  if (vote === "upVote") {
    video.votes.upVotes =
      change === "increase" ? video.votes.upVotes + 1 : video.votes.upVotes - 1;
  }

  if (vote === "downVote") {
    video.votes.downVotes =
      change === "increase"
        ? video.votes.downVotes + 1
        : video.votes.downVotes - 1;
  }

  video = await video.save();

  // console.log(" updated video of votes :",video);

  return video;
};

const patchViews = async (id) => {
  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
  }

  video.viewCount += 1;

  return await video.save();
};

const webHooks = async (id, body) => {
  if (!Types.ObjectId.isValid(id)) return null;

  const video = await Video.findById(id);

  if (!video) return null;

  video.videoLink = body.indexUrl;
  video.previewImage = body.previewImage;

  return await video.save();
};

module.exports = {
  videoPost,
  getVideoById,
  getVideoByFilter,
  patchVotes,
  patchViews,
  webHooks,
};
