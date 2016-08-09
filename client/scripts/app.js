$(document).ready(function() {
  app.fetch();

  $('.message-btn').on('click', function() {
    app.handleSubmit();
  });

  $('.text-input').keypress(function(e) {
    if (e.which === 13) {
      app.handleSubmit();
    }
  });

  $('input:text:visible:first').focus();

  setInterval(app.fetch, 1000);
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
  var loggedInUser = window.location.search.slice(window.location.search.indexOf('=') + 1);
  message.username = loggedInUser;
  console.log(message);
  app.addMessage(message);
  app.send(message);
  $('.text-input').val('');
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
      for ( var i = results.length - 1; i >= 0; i-- ) {
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
  var time = message.createdAt;

  var $chats = $('#chats');

  var $chat = $('<div>', {class: 'chat'});
  var $username = $('<div>', {class: 'username'});
  var $text = $('<div>', {class: 'chat chat-text'});
  var $time = $('<div>', {class: 'chat chat-time'});

  $username.text(username);
  $text.text(text);
  $time.text(calculateSince(time));

  $chat.append($username);
  $chat.append($text);
  $chat.append($time);
  $chats.prepend($chat);

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

// Calculates the time since the tweet was created
var calculateSince = function(datetime) {
    
  var tTime = new Date(datetime);
  var cTime = new Date();
  var sinceMin = Math.round((cTime-tTime)/60000);
  
  if (sinceMin === 0) {
    var sinceSec = Math.round((cTime-tTime)/1000);
    if (sinceSec < 10) {
      var since = 'less than 10 seconds ago';
    } else if (sinceSec < 20) {
      var since = 'less than 20 seconds ago';
    } else {
      var since = 'half a minute ago';
    }
  } else if (sinceMin === 1) {
    var sinceSec = Math.round((cTime-tTime)/1000);
    if (sinceSec === 30) {
      var since = 'half a minute ago';
    } else if (sinceSec < 60) {
      var since = 'less than a minute ago';
    } else {
      var since = '1 minute ago';
    }
  } else if (sinceMin < 45) {
    var since = sinceMin + ' minutes ago';
  } else if (sinceMin > 44 && sinceMin < 60) {
    var since = 'about 1 hour ago';
  } else if (sinceMin < 1440) {
    var sinceHr = Math.round(sinceMin/60);
    if (sinceHr === 1) {
      var since = 'about 1 hour ago';
    } else {
      var since = 'about ' + sinceHr + ' hours ago';
    }
  } else if (sinceMin > 1439 && sinceMin < 2880) {
    var since = '1 day ago';
  } else {
    var sinceDay = Math.round(sinceMin/1440);
    var since = sinceDay + ' days ago';
  }
  return since;
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

