
//Dynamicaly update list of available and occupied players
db.ref('roster').on('value', function(snapshot) {
	//Assign roster object to obj
	var obj = snapshot.val();	

	//Empty list of available/playing
	$('#available-list').empty();
	$('#playing-list').empty();

	//Iterate through and append buttons accordingly
	names.forEach(function (player) {
		//obj[player].occupied ? playing.push(player) : available.push(player);
		if(obj[player].occupied) {
			$('#playing-list').append($('<button>').text(player));
		} else {
			$('#available-list').append($('<button>').text(player).attr('class','available'));
		}
	});

	if (currentPlayer){
		$('#currentPlayer').text(currentPlayer);
	} else {
		$('#currentPlayer').text('none');
	}
});

$(document).on('click','.available',function() {
	signOn($(this).text());
});
