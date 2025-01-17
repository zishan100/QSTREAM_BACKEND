require("dotenv").config();

let io;

module.exports = {
  init: (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
      cors: {
        origin:
          process.env.NODE_ENVIRONMENT === "development"
            ? "http://localhost:3000"
            : "https://qstream-frontend.vercel.app",
      },
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("Socket.io is not initialized!");
    }
    return io;
  },
};
