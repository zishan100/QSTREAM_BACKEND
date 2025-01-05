const regexPattern = /^[0-9a-fA-F]{24}$/;

const videoLink = (values, helpers) => {
  let arr = values.split("/").filter((items) => items !== "");

  if (arr[0] === "https:") {
    if (
      arr.length !== 4 ||
      !(arr[1] === "www.youtube.com" && arr[2] === "embed")
    ) {
      return helpers.message("Invalid video link");
    }
  }

  if (arr[0] === "youtube.com") {
    if (arr.length !== 3 || !(arr[0] === "youtube.com" && arr[1] === "embed")) {
      return helpers.message("Invalid video link");
    }
  }

  return values;
};

const objectId = (values, helpers) => {
  if (!values.match(regexPattern)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }

  return values;
};

const checkContentRating = (values, helpers) => {
  console.log(values);
  const ratingArr = ["Anyone", "7+", "12+", "16+", "18+"];

  if (!ratingArr.includes(values)) {
    return helpers.message(
      ' "{{#include}}" must be one of [Anyone, 7+, 12+, 16+, 18+, All] '
    );
  }

  return values;
};

const checkGenres = (values, helpers) => {
  const allGenres = [
    "Education",
    "Sports",
    "Movies",
    "Comedy",
    "Lifestyle",
    "All",
  ];
  const genresArr = values.split(",");

  for (const genre of genresArr) {
    if (!allGenres.includes(genre)) {
      return helpers.message(
        ' "{{#include}}" must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]'
      );
    }
  }

  return values;
};

const sortBy = (values, helpers) => {
  const allSortBy = ["viewCount", "releaseDate"];

  if (!allSortBy.includes(values)) {
    return helpers.message(
      ' "{{#include}}" must be one of [viewCount, releaseDate]'
    );
  }

  return values;
};

const passwordCheck = (values, helpers) => {
  const hasUpperCase = /[A-Z]/.test(values);
  const hasLowerCase = /[a-z]/.test(values);
  const hasNumber = /[0-9]/.test(values);
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(values);

  if (!hasNumber) {
    return helpers.message("{{#label}} should be contain atleast one digit");
  } else if (!hasUpperCase) {
    return helpers.message(
      "{{#label}} should be contain atleast one uppercase"
    );
  } else if (!hasLowerCase) {
    return helpers.message(
      "{{#label}} should be contain atleast one lowercase"
    );
  } else if (!specialChar) {
    return helpers.message(
      "{{#label}} should be contain atleast one special character"
    );
  }

  return values;
};

const emailCheck = (values, helpers) => {
  const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/.test(
    values
  );

  if (!isValid) {
    return helpers.message("Please enter valid email");
  }

  return values;
};

module.exports = {
  videoLink,
  objectId,
  checkContentRating,
  checkGenres,
  sortBy,
  passwordCheck,
  emailCheck,
};
