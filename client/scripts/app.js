$(document).ready(function() {
  app.fetch();

  $('.message-btn').on('click', function() {
    app.handleSubmit();
  });
});

// var url = 'https://api.parse.com/1/classes/messages';
var message;
var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  // initialize stuff (parse?)
};


app.handleSubmit = function() {
  message = {};
  message.text = $('.text-input').val();
  console.log(message);
  debugger;
  app.addMessage(message);
  app.send(message);
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(message)
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    dataType: 'json',
    // data: JSON.parse(data),
    success: function(data) {
      console.log(data);
      var results = data.results;
      for ( var i = 0; i < results.length; i++ ) {
        var message = results[i];
        app.addMessage(message);
      }
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var username = message.username;
  var text = message.text;

  var $chats = $('#chats');
  var $chat = $('<div>', {class: 'chat'});
  var $username = $('<div>', {class: 'username'});
  var $text = $('<div>', {class: 'chat chat-text'});

  $username.text(username);
  $text.text(text);

  $chat.append($username);
  $chat.append($text);
  $chats.append($chat);

  $username.on('click', function() {
    app.addFriend(username);
  });
};

app.addRoom = function(roomName) {
  var $roomSelect = $('#roomSelect');
  var $room = $('<div>', {class: 'room'});
  $room.text(roomName);
  $roomSelect.append($room);
};

app.addFriend = function(username) {
  var $newFriend = $('<div>', {class: 'friend friend-username'});
  $newFriend.text(username);
  $('#friends').append($newFriend);
};

// Cross-Site Scripting (XSS) PROTECTION 
  // we'll wrap all messages / user input in this escape HTML func
var entityMapping = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function(char) {
    return entityMapping[char];
  });
};



// console.log(getThis);
/*$(document).ready( function () {
  $('.message-pane').click(function () {
    $(this).slideUp();
  });
*/


  // server request URL : 'https://api.parse.com/1/classes/messages'
 /* $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/messages',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
  }
	});*/

