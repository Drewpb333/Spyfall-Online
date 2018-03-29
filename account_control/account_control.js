var config = {
	apiKey: "AIzaSyAGNVQ9YDyUNSl_7RNF10MmNzHEJHYtOJE",
	authDomain: "spyfall-e6768.firebaseapp.com",
	databaseURL: "https://spyfall-e6768.firebaseio.com",
	projectId: "spyfall-e6768",
	storageBucket: "spyfall-e6768.appspot.com",
	messagingSenderId: "1066986603676"
};
firebase.initializeApp(config);
//var to hold auth object
var db = firebase.database();
var names = ['Link','Mario','Zelda','Peach','Megaman','Samus','Cloud','Sephiroth'];
var available, playing;
var currentPlayer

//Initialize list of available and playing characters
db.ref('roster').on('value', function(snapshot) {
	available = [];
	playing = [];
	var obj = snapshot.val();	
	names.forEach(function (player) {
		obj[player].occupied ? playing.push(player) : available.push(player);
	});
});


//FOR ADMIN USE ONLY; kicks all players out
function resetDB() {
	db.ref('roster').remove();
	names.forEach(function (player) {
		db.ref('roster/'+player).set({occupied:false});
	});
}

function signOn(index) {
	currentPlayer = available[index];
	db.ref('roster/'+available[index]).set({occupied: true});
	db.ref('roster/'+available[index]).onDisconnect().set({occupied: false});
}
