
$('body').load('ui/lobby.html');
renderPlayerList('#player-list');

//----------------------------Listeners-----------------------------------------------

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
		$('body').load('ui/game.html');
		db.ref('game/phase').set('gameOn');
	}
});

//----------------------------Function Declarations-----------------------------------------------



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
					tdPlayer.attr('class','btn btn-success own-player');
					readyBox.attr('id','check-ready').removeAttr('disabled');
				}
			} else { //Not playing
				if(snapshot[list[i]].occupied) { //occupied
					tdPlayer.append('<input type="button" value="'+list[i]+'" class="join-game btn joinedPlayerName" disabled>');
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
			$('#player-list').append('<input type="button" id="sign-off" value="Sign Off">');
		}
	});
}
