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
	});
}

