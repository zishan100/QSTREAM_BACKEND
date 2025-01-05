const mongoose = require("mongoose");
const httpServer = require("./app");
const config = require("./config/config");
const service = require("./services/consumer.service");
let server;

service.init();

mongoose
  .connect(config.mongoose.url, { ...config.mongoose.options })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect DB at :", err));

httpServer.listen(config.port, () => {
  console.log("Server is listening on :", config.port);
});
