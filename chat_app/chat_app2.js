$(document).ready(function(){
	var config = {
	apiKey: "AIzaSyAQbtznyx7eg2s-4qn_cDDiKU-VmmGhecI",
	authDomain: "spyfall-1fe22.firebaseapp.com",
	databaseURL: "https://spyfall-1fe22.firebaseio.com",
	projectId: "spyfall-1fe22",
	storageBucket: "spyfall-1fe22.appspot.com",
	messagingSenderId: "1078600510586"
  };

firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

//db refers to database
var chatroom = database.ref('chatroom');
var localMsgCount = 0;
var chatBox = $(".chatbox");
var sendForm = "#send-form";

//assume <form id=sendForm/>
function initChat(sendForm) {
	//Build the message sender box
	$(sendForm).append('<input type="text" name="username"/>');
	$(sendForm).append('<input type="text" name="message"/>');
	$(sendForm).append('<input type="submit"/>');	
}

initChat(sendForm);

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
});
	//Update chatBox container with messages
	chatroom.on('child_added',function (snapshot) {
		var msg_in = snapshot.val();
		var msg_out = $('<div class="message">');

		msg_out.append($('<span class="chat-user">').text(msg_in.user));
		msg_out.append($('<span class="chat-text">').text(msg_in.message));

		chatBox.append(msg_out);
	});
})
// $(".panel-body").on("click", "#submit-button", function(evt){
// 	// initChat(chatBox,sendForm);
// 	evt.preventDefault();
// })