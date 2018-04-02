var config = {
	apiKey: "AIzaSyAGNVQ9YDyUNSl_7RNF10MmNzHEJHYtOJE",
	authDomain: "spyfall-e6768.firebaseapp.com",
	databaseURL: "https://spyfall-e6768.firebaseio.com",
	projectId: "spyfall-e6768",
	storageBucket: "spyfall-e6768.appspot.com",
	messagingSenderId: "1066986603676"
};
firebase.initializeApp(config);

var chatroom = firebase.database().ref('chatroom');

//assume <form id=sendForm/>
function initChat(chatBox,sendForm) {
	//Build the message sender box
	$(sendForm).append('<input type="text" name="message"/>');
	$(sendForm).append('<input type="submit" >');	

	$(document).on('submit',sendForm, function(evt) {
		//prevent page refresh
		evt.preventDefault();
		
		if (currentPlayer!='') {
			//grab values from form
			var user = currentPlayer;
			var message = $(sendForm+'> input[name="message"]').val().trim();
			
			//add message to firebase
			chatroom.push({user: user, message: message, time: firebase.database.ServerValue.TIMESTAMP}); 
			//clear forms
			$(sendForm+'> input[name="message"]').val('');
		} else {
			//push error message to chatlog (not persistent)
			$(chatBox).append('<div class="error-message">You need to sign in first!</div>');
		}



	});
	
	//Update chatBox container with messages
	chatroom.on('child_added',function (snapshot) {
		var msg_in = snapshot.val();
		var msg_out = $('<div class="message">');

		msg_out.append($('<span class="chat-user">').text(msg_in.user));
		msg_out.append(': ');
		msg_out.append($('<span class="chat-text">').text(msg_in.message));

		$(chatBox).append(msg_out);
	});
}



