let userSocketMap = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.user.id);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });
};
