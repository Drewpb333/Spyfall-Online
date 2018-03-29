// Initialize Firebase
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
var auth = firebase.auth();
var db = firebase.database();

//pull roster from firebase db
displayRoster();

var user;
$(document).ready(function() {
	//click listener for sign-in button
	$('form').submit(function(evt) {
		//Prevent page refresh
		evt.preventDefault();
		//Firebase Anonymous Account Creation	
		auth.signInAnonymously().catch(function(error) {
			console.error(error.message);
		});

		//Once created, add to roster
		auth.onAuthStateChanged(function(usr) {
			if(usr) {
				//Assign user's display name from form input
				var dName = $('input:text').val().trim();
				usr.updateProfile({displayName: dName});
				user = usr;
				console.log(user.displayName);	

				//update roster
				db.ref('roster/'+user.uid).set({uid: user.uid, displayName: user.displayName});
				displayRoster();
			}
			else {
				console.log('no user returned');
			}
		});
	});
});

//Returns array of displayNames on roster
function displayRoster() {
	console.log(db.ref('roster/'));
}

function addUser() {
	
}
