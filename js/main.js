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

//Declare globally used variables
var db = firebase.database();

//local var to hold name of user of this session; empty of not playing
var currentPlayer = '';

//disconnect object for firebase to sign off on disconnect
var disconnect;

db.ref('game/phase').on('value', function(snapshot) {
	switch (snapshot.val()) {
		case 'lobby':
			console.log('Building lobby page...');
			renderLobby();
			break;
	}
});


//----------------------------------Universal----------------------------------------------------

//Resets firebase to new list of player names; or kick everyone out of game
//['Link','Mario','Zelda','Peach','Megaman','Samus','Cloud','Sephiroth'];
function resetPlayers(list) {
	db.ref('players').remove();
	list.forEach(function (player) {
		db.ref('players/'+player).set({occupied:false, ready:false});
	});
	db.ref('game/phase').set('lobby');
}
