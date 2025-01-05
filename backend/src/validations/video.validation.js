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

const webHooks = {
  body: Joi.object().keys({
    indexUrl: Joi.string().required(),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  videoPost,
  getVideoById,
  getVideo,
  patchVotes,
  patchViews,
  webHooks,
};
