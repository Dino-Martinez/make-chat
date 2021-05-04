module.exports = (io, socket, onlineUsers) => {
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

  socket.on("disconnect", () => {
    delete onlineUsers[socket.username];
    io.emit("user has left", onlineUsers);
  });
};
