// YOUR CODE HERE:


var app = {
  url: 'https://api.parse.com/1/classes/messages'
};





console.log(app);

// fetch messages

  var getThis = $.ajax({
								    url: app.url,
								    type: 'GET',
								  
								  });



console.log(getThis);
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

