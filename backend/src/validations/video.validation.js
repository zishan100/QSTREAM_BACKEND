const Joi = require("joi");
const {
  videoLink,
  objectId,
  checkGenres,
  checkContentRating,
  sortBy,
} = require("./custom.validation");

const videoPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    contentRating: Joi.string().required(),
    releaseDate: Joi.string().required(),
    videoUploading: Joi.boolean()
  }),
};

const getVideoById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const getVideo = {
  query: Joi.object().keys({
    title: Joi.string(),
    genres: Joi.string().custom(checkGenres),
    contentRating: Joi.string().custom(checkContentRating),
    sortBy: Joi.string().custom(sortBy),
  }),
};

const patchVotes = {
  body: Joi.object().keys({
    vote: Joi.string().required(),
    change: Joi.string().required(),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const patchViews = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const getVideoByUploadState = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
    videoId: Joi.string().custom(objectId).required(),
  }),
};

const videoUpdateByParams = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required()
  }),
  body: Joi.object().keys({
    videoLink: Joi.string().custom(videoLink).required(),
    previewImage: Joi.string().custom(videoLink).required()
  })
}

module.exports = {
  videoPost,
  getVideoById,
  getVideo,
  patchVotes,
  patchViews,
  getVideoByUploadState,
  videoUpdateByParams
};
