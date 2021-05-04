$(document).ready(() => {
  const socket = io.connect();
  let currentUser = "";

  socket.emit("get online users");

  socket.emit("user changed channel", "General");

  $(document).on("click", ".channel", e => {
    const newChannel = e.target.textContent;
    socket.emit("user changed channel", newChannel);
  });

  $("#create-user-btn").click(e => {
    e.preventDefault();
    if ($("#username-input").val().length > 0) {
      socket.emit("new user", $("#username-input").val());
      currentUser = $("#username-input").val();
      $(".username-form").remove();
      // Have the main page visible
      $(".main-container").css("display", "flex");
    }
  });

  $("#log-out-btn").click(e => {
    e.preventDefault();
    socket.disconnect();
    window.location.replace("/");
  });

  $("#new-channel-btn").click(e => {
    e.preventDefault();
    let newChannel = $("#new-channel-input").val();

    if (newChannel.length > 0) {
      socket.emit("new channel", newChannel);
      $("#new-channel-input").val("");
    }
  });

  // Socket emitter
  $("#send-chat-btn").click(e => {
    e.preventDefault();
    const channel = $(".channel-current").text();
    const message = $("#chat-input").val();
    if (message.length > 0) {
      socket.emit("new message", {
        author: currentUser,
        content: message,
        channel: channel
      });

      $(".message-container").append(
        `
        <div class="message">
          <h3 class="message-user">${currentUser}:</h3>
          <p class="message-text">${$("#chat-input").val()}</p>
        </div>
        `
      );
    }

    $("#chat-input").val("");
  });

  //socket listeners
  socket.on("new user", (username, channels) => {
    console.log(`${username} has joined the chat`);
    // Add the new user to the online users div
    socket.emit("get online users");
    for (channel in channels) {
      $(".channels").append(`<div class="channel">${channel}</div>`);
    }
  });

  socket.on("new message", message => {
    const { author, content } = message;
    $(".message-container").append(
      `
      <div class="message">
        <h3 class="message-user">${author}:</h3>
        <p class="message-text">${content}</p>
      </div>
      `
    );
  });

  socket.on("get online users", onlineUsers => {
    $(".users-online").empty();
    for (username in onlineUsers) {
      $(".users-online").append(`<div class="user-online">${username}</div>`);
    }
  });

  socket.on("user has left", onlineUsers => {
    $(".users-online").empty();
    for (username in onlineUsers) {
      $(".users-online").append(`<div class="user-online">${username}</div>`);
    }
  });

  socket.on("new channel", newChannel => {
    $(".channels").append(`<div class="channel">${newChannel}</div>`);
  });

  socket.on("user changed channel", data => {
    $(".channel-current").addClass("channel");
    $(".channel-current").removeClass("channel-current");
    $(`.channel:contains('${data.channel}')`).addClass("channel-current");
    $(".channel-current").removeClass("channel");
    $(".message").remove();
    data.messages.forEach(message => {
      $(".message-container").append(`
      <div class="message">
        <p class="message-user">${message.sender}: </p>
        <p class="message-text">${message.message}</p>
      </div>
    `);
    });
  });
});
