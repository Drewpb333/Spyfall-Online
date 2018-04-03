//Initialize Firebase
var config = {
	apiKey: "AIzaSyAGNVQ9YDyUNSl_7RNF10MmNzHEJHYtOJE",
	authDomain: "spyfall-e6768.firebaseapp.com",
	databaseURL: "https://spyfall-e6768.firebaseio.com",
	projectId: "spyfall-e6768",
	storageBucket: "spyfall-e6768.appspot.com",
	messagingSenderId: "1066986603676"
};
firebase.initializeApp(config);


/* Sample Firebase Database structure
 * spyfall = {
 * 		game: {
 * 			phase: 'lobby',
 * 		},
 * 		players: {
 * 			Link: {
 * 				occupied: false
 * 				ready: false
 * 			},
 * 			Mario: {
 * 				occupied: false
 * 				ready: false
 * 			},
 * 		}
 * }
 */

 //------------------------------------------Global-------------------------------------------------------
//Declare globally used variables
var db = firebase.database();
//local var to hold name of user of this session; empty of not playing
var currentPlayer = '';
//disconnect object for firebase to sign off on disconnect
var disconnectOccupied, disconnectReady;

db.ref('game/phase').on('value', function(snapshot) {
	switch (snapshot.val()) {
		case 'lobby':
			renderLobby();
			break;
		case 'in-progress':
			renderGame();
			break;
	}
});

//Resets firebase to new list of player names; or kick everyone out of game
//['Link','Mario','Zelda','Peach','Megaman','Samus','Cloud','Sephiroth'];
function resetPlayers(list) {
	db.ref('players').remove();
	list.forEach(function (player) {
		db.ref('players/'+player).set({occupied:false, ready:false});
	});
	db.ref('game/phase').set('lobby');
}

//------------------------------------Lobby-----------------------------------------------------------
function renderLobby() {
	$('body').load('ui/lobby.html', function () {
		renderPlayerList('#player-list');
		initChat('.chatbox','#send-form');
	});
}

//Listeners to join game
$(document).on('click','.join-game', function() {
	signOn($(this).val());
});

//Listener to sign off
$(document).on('click','#sign-off', function() {
	signOff();
	$('#sign-off').remove();
});

//Listener to check ready
$(document).on('change','#check-ready', function() {
	if($(this).is(':checked')) {
		db.ref('players/'+currentPlayer+'/ready').set(true);
	} else {
		db.ref('players/'+currentPlayer+'/ready').set(false);
	}
});

//Are there at least 3 players ready
db.ref('players').on('value', function (snapshot) {
	var readyCount = 0;
	var playerNotReady = false;
	var players = snapshot.val();
	for (player in players) {
		//If occupied and ready == true -> readyCount++
		if (players[player].occupied && players[player].ready) {
			readyCount++;
		} else if (players[player].occupied && !players[player].ready) {
			playerNotReady = true;
		}
		//if occupied and NOT  ready -> playerNotReady=true
	}
	if (!playerNotReady && readyCount>=2) {
		//Load Game
		renderGame();
		db.ref('game/phase').set('gameOn');
	}
});

//Join the game and take a player slot
function signOn(name) {
	db.ref('players/'+name+'/occupied').once('value', function (snapshot) {
		var occupied = snapshot.val();
		if (occupied || currentPlayer!='') {
			console.log("name doesn't exist or is taken.");
		} else {
			currentPlayer = name;
			//set occupied flag
			db.ref('players/'+currentPlayer+'/occupied').set(true);
			//add disconnect listener to free slot
			disconnectOccupied = db.ref('players/'+currentPlayer+'/occupied').onDisconnect()
			disconnectOccupied.set(false);
			disconnectReady = db.ref('players/'+currentPlayer+'/ready').onDisconnect()
			disconnectReady.set(false);
			//enable chat submit button
			$().removeProp('disabled');	
		}
	});
}

//Quit the game, freeing up the player slot
function signOff() {
	if (currentPlayer!='') {
		var tmp = currentPlayer;
		currentPlayer = '';
		db.ref('players/'+tmp+'/occupied').set(false);
		db.ref('players/'+tmp+'/ready').set(false);
		disconnectOccupied.cancel();
		disconnectReady.cancel();
	} else {console.log('signoff error');}
}

/*
<table class="lobby-list">
	<tr>
		<th>Players</th>
		<th>Ready</th>
	</tr>
	---------------Not joined-------------------
	<tr>
		<td><input type="button" value="Link"></td>
		<td><input type="checkbox"></td>
	</tr>
	----------------Joined-----------------
	<tr>
		<td>Mario</td>
		<td><input type="checkbox" disabled></td>
	</tr>
	----------------Joined, Own player-----------------
	<tr>
		<td class="own-player">Mario</td>
		<td><input type="checkbox" id="check-ready"></td>
	</tr>
</table>
*/
function renderPlayerList(container) {
	//create listener for value changes
	db.ref('players').on('value',function(snapshot) {
		//Initiate table and add header
		var table = $('<table>').attr('class','table lobby-list');
		table.append('<tr><th class="lobbyTableHeaders">Players</th><th class="lobbyTableHeaders">Ready</th><tr>');
		//iterate through player properties from firebase
		snapshot = snapshot.val();
		var list = Object.keys(snapshot);
		for (var i=0; i< list.length; i++) {
			//Player Element
			//Cases: Playing-not own player, Playing-own player, Not playing-available, Not playing, occupied
			var row = $('<tr>');
			var tdPlayer = $('<td>');
			var readyBox = $('<input type="checkbox" disabled>');
			if (currentPlayer != '') { //Playing
				tdPlayer.text(list[i]);
				if (list[i] == currentPlayer) { //own player
					tdPlayer.addClass('own-player btn btn-success');
					readyBox.attr('id','check-ready').removeAttr('disabled');
				}
			} else { //Not playing
				if(snapshot[list[i]].occupied) { //occupied
					tdPlayer.append('<input type="button" value="'+list[i]+'" class="join-game joinedPlayerName btn" disabled>');
				} else { //available
					tdPlayer.append('<input type="button" value="'+list[i]+'" class="join-game btn btn-default lobbyPlayerName" >');
				}
			}
			if (snapshot[list[i]].ready) {
				readyBox.prop('checked',true);
			}
			//Append elements to row
			row.append(tdPlayer).append($('<td>').append(readyBox));
			//Append row to table
			table.append(row);
		}
		$(container).empty();
		$(container).append(table);
		if (currentPlayer!='') {
			$('#player-list').append('<input type="button" id="sign-off" class="btn btn-danger" value="Sign Off">');
		}
	});
}
//------------------------------------Chat-----------------------------------------------------------

var chatroom = firebase.database().ref('chatroom');

//assume <form id=sendForm/>
function initChat(chatBox,sendForm) {
	//Build the message sender box
	$(sendForm).append('<input type="text" name="message"/>');
	$(sendForm).append('<input type="submit" class="btn btn-primary">');	

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




//-----------------------------------------Game Screen--------------------------------------------------------------------------------
function renderGame() {
	$('body').load('ui/game.html',function() {
		
	});
}