const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { videoService } = require("../services/index");
const { getIo } = require("../services/socketInstance.service");
const { get } = require("mongoose");

const videoPost = catchAsync(async (req, res) => {
  const video = await videoService.videoPost(req.body);

  res.status(httpStatus.CREATED).json(video);
});

const getVideoById = catchAsync(async (req, res) => {
  const videoId = req.params.id;

  const video = await videoService.getVideoById(videoId);

  res.status(httpStatus.OK).json(video);
});

const getVideo = catchAsync(async (req, res) => {
  const { title, contentRating, genres, sortBy } = req.query;

  // console.log(title," ",contentRating,"  ",genres," ",sortBy);
  const filter = { title, contentRating, genres, sortBy };

  // console.log(filter);

  const video = await videoService.getVideoByFilter(filter);
  // console.log("Total video :",video.videos.length);
  res.status(httpStatus.OK).json(video);
});

const patchVotes = catchAsync(async (req, res) => {
  const { id } = req.params;
  // console.log("id :",id," ",req.body);

  const video = await videoService.patchVotes(id, req.body);

  res.status(httpStatus.NO_CONTENT).send();
});

const patchViews = catchAsync(async (req, res) => {
  const { id } = req.params;

  const video = await videoService.patchViews(id);

  // console.log("updated video views :",video);

  res.status(httpStatus.NO_CONTENT).send();
});

const videoWebHooks = catchAsync(async (req, res) => {
  const { id } = req.params;

  let video = await videoService.webHooks(id, req.body);

  /* webSocket response to client on success & failure of webHooks call  */

  const io = getIo();

  if (!video) {
    console.log("Called webSocket to client on failiure of video streaming ");
  } else {
    console.log("Called webSocket to client on success of video streaming ");
    io.emit("serverToClient");
  }

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  videoPost,
  getVideoById,
  getVideo,
  patchVotes,
  patchViews,
  videoWebHooks,
};
