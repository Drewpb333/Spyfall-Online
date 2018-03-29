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
//local var to hold name of this user
var currentPlayer, disconnect;

//Updates arrays of available and playing (occupied) players in real-time
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

//index refers to index on available array
function signOn(index) {
	currentPlayer = available[index];
	//set occupied flag
	db.ref('roster/'+available[index]+'/occupied').set(true);
	//add disconnect listener to free slot
	disconnect = db.ref('roster/'+currentPlayer+'/occupied').onDisconnect()
	disconnect.set(false);
}
