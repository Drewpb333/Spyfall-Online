var config = {
	apiKey: "AIzaSyAGNVQ9YDyUNSl_7RNF10MmNzHEJHYtOJE",
	authDomain: "spyfall-e6768.firebaseapp.com",
	databaseURL: "https://spyfall-e6768.firebaseio.com",
	projectId: "spyfall-e6768",
	storageBucket: "spyfall-e6768.appspot.com",
	messagingSenderId: "1066986603676"
};
firebase.initializeApp(config);
var db = firebase.database();
var available, playing;
//local var to hold name of user of this session; empty of not playing
var currentPlayer = '';
//disconnect object for firebase to sign off on disconnect
var disconnect;
var names = ['Link','Mario','Zelda','Peach','Megaman','Samus','Cloud','Sephiroth'];

//----------------------------------Universal----------------------------------------------------

function resetGame() {
	db.ref('players').remove();
	names.forEach(function (player) {
		db.ref('players/'+player).set({occupied:false, ready:false});
	});
	db.ref('game/phase').set('lobby');
}

//----------------------------------Game Lobby---------------------------------------------------

//Join the game and take a player slot
function signOn(name) {
	db.ref('players/'+name+'/occupied').once('value', function (snapshot) {
		var occupied = snapshot.val();
		if (occupied) {
			console.log("name doesn't exist or is taken.");
		} else {
			currentPlayer = name;
			//set occupied flag
			db.ref('players/'+currentPlayer+'/occupied').set(true);
			//add disconnect listener to free slot
			disconnect = db.ref('players/'+currentPlayer+'/occupied').onDisconnect()
			disconnect.set(false);
		}
	});
}

//Quit the game, freeing up the player slot
function signOff() {
	if (names.indexOf(currentPlayer)>-1) {
		var tmp = currentPlayer;
		currentPlayer = '';
		db.ref('players/'+tmp+'/occupied').set(false);
		disconnect.cancel();
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
		<td><input type="checkbox"></td>
	</tr>
	----------------Joined, Own player-----------------
	<tr>
		<td class="own-player">Mario</td>
		<td><input type="checkbox"></td>
	</tr>
</table>
*/
function renderLobby(container) {
	//create listener for value changes
	db.ref('players').on('value',function(snapshot) {
		//Initiate table and add header
		var table = $('<table>').attr('class','lobby-list');
		table.append('<tr><th>Players</th><th>Ready</th><tr>');
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
					tdPlayer.attr('class','own-player');
					readyBox.removeAttr('disabled');
				}
			} else { //Not playing
				if(snapshot[list[i]].occupied) { //occupied
					tdPlayer.append('<input type="button" value="'+list[i]+'" disabled>');
				} else { //available
					tdPlayer.append('<input type="button" value="'+list[i]+'">');
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
	});
}