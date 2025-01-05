const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const routes = require("./routes/v1");
const ApiError = require("./utils/ApiError");
const helmet = require("helmet");
const { errorHandler } = require("./middlewares/error");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = http.createServer(app);

const io = require("./services/socketInstance.service").init(httpServer);

// set security HTTP headers - https://helmetjs.github.io/
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// Reroute all API request starting with "/v1" route
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorHandler);

require("./services/socket.service")(io);

module.exports = httpServer;
