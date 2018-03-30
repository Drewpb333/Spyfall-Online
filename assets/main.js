
//Dynamicaly update list of available and occupied players
db.ref('roster').on('value', function(snapshot) {
	var obj = snapshot.val();	
	names.forEach(function (player) {
		//obj[player].occupied ? playing.push(player) : available.push(player);
		if(obj[player].occupied) {
		} else {
		}
	});
});

$(document).ready(function() {
});
