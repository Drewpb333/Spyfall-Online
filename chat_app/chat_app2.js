//db refers to database
var chatroom = db.ref('chatroom');
var localMsgCount = 0;

//assume <form id=sendForm/>
function initChat(logDiv, sendForm) {
	//Build the message sender box
	$(sendForm).append('<input type="text" name="username"/>');
	$(sendForm).append('<input type="text" name="message"/>');
	$(sendForm).append('<input type="submit"/>');
	$(document).on('submit',sendForm, function(evt) {
		//prevent page refresh
		evt.preventDefault();

		//grab values from form
		var user = $(sendForm+'> input[name="username"]').val().trim();
		var message = $(sendForm+'> input[name="message"]').val().trim();
		//
		//add message to firebase
		chatroom.push({user: user, message: message, time: firebase.database.ServerValue.TIMESTAMP}); 
		//clear forms
		$(sendForm+'> input[name="username"]').val('');
		$(sendForm+'> input[name="message"]').val('');

		//Update logDiv container with messages
		chatroom.on('child_added',function (snapshot) {
			var msg_in = snapshot.val();
			var msg_out = $('<div class="message">');

			msg_out.append($('<span class="chat-user">').text(msg_in.user));
			msg_out.append($('<span class="chat-text">').text(msg_in.message));

			$(logDiv).append(msg_out);
		});

	});
}

