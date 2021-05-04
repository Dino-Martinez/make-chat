module.exports = (io, socket, onlineUsers, channels) => {
  socket.on("new user", username => {
    onlineUsers[username] = socket.id;
    socket["username"] = username;

    console.log(`${username} has joined the chat`);
    io.emit("new user", username);
  });

  socket.on("new message", message => {
    console.log(message);
    socket.broadcast.emit("new message", message);
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

  socket.on("disconnect", () => {
    delete onlineUsers[socket.username];
    console.log(`${socket.username} has left the chat`);
    io.emit("user has left", onlineUsers);
  });
};
