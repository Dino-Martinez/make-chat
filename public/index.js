$(document).ready(() => {
  const socket = io.connect();
  let currentUser = "";
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
  // Socket emitter
  $("#send-chat-btn").click(e => {
    e.preventDefault();
    $(".message-container").append(
      `
      <div class="message">
        <h3 class="message-user">${currentUser}:</h3>
        <p class="message-text">${$("#chat-input").val()}</p>
      </div>
      `
    );
    socket.emit("new message", {
      author: currentUser,
      content: $("#chat-input").val()
    });
    $("#chat-input").val("");
  });

  //socket listeners
  socket.on("new user", username => {
    console.log(`${username} has joined the chat`);
    // Add the new user to the online users div
    $(".users-online").append(`<div class="user-online">${username}</div>`);
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
});
