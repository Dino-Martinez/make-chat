module.exports = (io, socket, onlineUsers, channels) => {
  socket.on("new user", username => {
    onlineUsers[username] = socket.id;
    socket["username"] = username;

    console.log(`${username} has joined the chat`);
    io.emit("new user", (username, channels));
  });

  socket.on("new message", message => {
    console.log(message);
    const rooms = Array.from(socket.rooms);
    const lastRoom = rooms.pop();
    socket.broadcast.to(lastRoom).emit("new message", message);
  });

  socket.on("get online users", () => {
    socket.emit("get online users", onlineUsers);
  });

  socket.on("new channel", newChannel => {
    channels[newChannel] = [];
    socket.join(newChannel);
    io.emit("new channel", newChannel);
    socket.emit("user changed channel", {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });

  socket.on("user changed channel", newChannel => {
    const rooms = Array.from(socket.rooms);
    const lastRoom = rooms.pop();
    if (lastRoom !== socket.id) {
      socket.leave(lastRoom);
    }
    socket.join(newChannel);
    console.log(socket.rooms);
    socket.emit("user changed channel", {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.username];
    console.log(`${socket.username} has left the chat`);
    io.emit("user has left", onlineUsers);
  });
};
