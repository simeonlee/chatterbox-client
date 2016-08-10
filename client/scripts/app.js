$(document).ready(function() {
  app.fetch();
  setTimeout(app.addMessages, 500);

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
  server: 'https://api.parse.com/1/classes/messages',
  roomnames: {},
  chatHistory: [],
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

var fetchMarker;
var addMarker;

var counter;

app.fetch = function(cb) {
  cb = cb || function (message) {
    app.addMessage(message);
    counter++;
  };

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
        if ( fetchMarker === message.objectId ) {
          break;
        } else {
          app.chatHistory.push(message);
          // cb(message);
          // app.addRoom(message);
        }
      }
      fetchMarker = results[0].objectId;

      // app.addMessages();
    }
  });
};

/*success: function (data) {
  for ( var i = 19; i >= 0; i-- ) {
    var message = data.results[i];
    var roomname = message.roomname;

  }
}*/


app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var username = escapeHtml(message.username);
  var text = escapeHtml(message.text);
  var time = escapeHtml(message.createdAt);
  var roomname = escapeHtml(message.roomname);

  var $chats = $('#chats');

  var $chat = $('<div>', {class: 'chat'});
  var $username = $('<div>', {class: 'username'});
  var $text = $('<div>', {class: 'chat chat-text'});
  var $time = $('<div>', {class: 'chat chat-time'});
  var $roomname = $('<div>', {class: 'chat chat-roomname'});

  $username.text(username);
  $text.text(text);
  $time.text(calculateSince(time));
  $roomname.text(roomname);

  $chat.append($username);
  $chat.append($text);
  $chat.append($time);
  $chat.append($roomname);
  $chats.prepend($chat);

  $username.on('click', function() {
    app.addFriend(username);
  });

  app.addRoom(message);
};


app.addMessages = function(roomname) {

  // Starts at Lobby upon page load, then we switch with a element click that originates from app.addRoom
  roomname = roomname || 'Lobby';

  // counter = 0;

  // while ( counter < 20 ) {
  for ( var i = app.chatHistory.length - 1; i >= 0; i-- ) {
    var message = app.chatHistory[i];
    if ( addMarker === message.objectId ) {
      break;
    } else {
      // If the currentRoom is equal to Lobby, print all messages for now
      if ( roomname === 'Lobby' ) {
        app.addMessage(message);

      // If the currentRoom is not equal to Lobby, it's clear we want to go to a different room
      // go to that room if the roomname of the message is equal to the currentRoom that we pulled from the DOM
      } else if ( roomname === message.roomname ) {
        app.addMessage(message);
      }
      // app.addMessage(message);
    }
  }

  addMarker = app.chatHistory[19].objectId;

  // for ( var i = 0; i < results.length; i++ ) {
  //       var message = results[i];
  //       if ( fetchMarker === message.objectId ) {
  //         break;
  //       } else {
  //         app.chatHistory.push(message);
  //         // cb(message);
  //         // app.addRoom(message);
  //       }
  //     }
  //     fetchMarker = results[0].objectId;
};

var currentRoom;

/*app.addRoom = function (message) {
  var roomname = message.roomname;
  if ( !app.roomnames[roomname] ) {
    var $roomname = $('<div>', {class: 'roomname'});
    $roomname.text(roomname);
    $('#roomSelect').append($roomname);

    $roomname.on('click', function () {
      currentRoom = roomname;
      $('.currentRoom').text(currentRoom);
      app.clearMessages();
      app.addMessages(roomname);
    });
  }

  app.roomnames[roomname] = true;
};*/

app.addRoom = function (message) {
  var roomname = message.roomname;
  if ( !app.roomnames[roomname] ) {
    var $roomname = $('<option>', {class: 'roomname', value: 'roomname', text: 'roomname'});
    $roomname.text(roomname);
    $('.chatRooms').append($roomname);

    


    /*$('.chatRooms option').on('click', function() {
      $('.chatRooms').html($(this).class('selected'));
    });

    $('.chatRooms').find(":selected")($roomname);

    $roomname.on('click', function () {
      currentRoom = roomname;
      $('.currentRoom').text(currentRoom);
      app.clearMessages();
      app.addMessages(roomname);
    });*/

    $roomname.on('click', function () {
      currentRoom = roomname;
      $('.currentRoom').text(currentRoom);
      app.clearMessages();
      app.addMessages(roomname);
    });
  }

  app.roomnames[roomname] = true;
};

// var cb = function (message) {
//   if ( message.roomname === currentRoom ) {
//     app.addMessage(message);
//     counter++;
//   }
// };
// app.fetch(cb);

app.addFriend = function(username) {
  var $newFriend = $('<div>', {class: 'friend friend-username'});
  $newFriend.text(username);
  $('#friends').append($newFriend);
};

app.displayFriendMsgs = function () {
  $('.friend-username').on('click', function () {
    $('#chats').empty();
    // display only messages from friend
  });
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

// NOTE: could have also used underbar's _.escape to accomplish this
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

