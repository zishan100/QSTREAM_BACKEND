const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { videoService } = require("../services/index");

const videoPost = catchAsync(async (req, res) => {
  const video = await videoService.videoPost(req);

  res.status(httpStatus.CREATED).json(video);
});

const getVideoById = catchAsync(async (req, res) => {
  const videoId = req.params.id;

  const video = await videoService.getVideoById(videoId);

  res.status(httpStatus.OK).json(video);
});

const getVideo = catchAsync(async (req, res) => {
  const { title, contentRating, genres, sortBy } = req.query;

  // console.log(title, " ", contentRating, "  ", genres, " ", sortBy);
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

/*    
  ## Get videos list by userId. 
*/
const getVideoListByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;

  const video = await videoService.getVideoListByUserId(id);

  res.status(httpStatus.OK).send(video);
})

/*    
  ## Get only video by userId which is in uploading state.
*/

const getVideoByUploadState = catchAsync(async (req, res) => {
  const { id, videoId } = req.params;

  const video = await videoService.getVideoByUploadState(id, videoId);

  res.status(httpStatus.OK).send(video);
})

/*    
  ## Video update By videoId params
*/

const videoUpdateByParams = catchAsync(async (req, res) => {
  const { params: { id }, body } = req;

  const video = await videoService.videoUpdateByParams(id, body);

  res.status(httpStatus.CREATED).send(video);
})



module.exports = {
  videoPost,
  getVideoById,
  getVideo,
  patchVotes,
  patchViews,
  getVideoListByUserId,
  getVideoByUploadState,
  videoUpdateByParams
};
