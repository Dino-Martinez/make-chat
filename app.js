//Express setup
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const server = require("http").Server(app);

// Socket setup
const io = require("socket.io")(server);
let onlineUsers = {};
let channels = { General: [] };

io.on("connection", socket => {
  require("./sockets/chat.js")(io, socket, onlineUsers, channels);
});

// Handlebars setup
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.render("index.handlebars");
});

// Dev server
// server.listen("3000", () => {
//   console.log("Server listening on port 3000");
// });

module.exports.handler = serverless(app);
