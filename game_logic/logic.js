$(document).ready(function () {
    var locations = ["Beach", "Casino", "Circus Tent", "Bank", "Day Spa", "Hotel",
        "Supermarket", "Hospital", "Military Base", "Police Station", "University",
        "Airplane", "Submarine", "Cathedral", "Corporate Party", "Movie Studio",
        "Crusader Army", "Pirate Ship", "Polar Station", "Space Station"
    ];
    var selectedLocation;
    var currentQuestioner;
    var round = 1;
    var playerLimit = 8;
    var users = ["Joe", "Rick", "John", "Jane", "Mary"]; //Users only created for demo purposes
    var userRoles = {};
    var questioner;
    var questionSubmitted;
    var displayUsers = $("#playersArray");
    var displayLocations = $("#locationsBox");
    var roundNumber = $("#round-number");
    var chatBox = $("#chatWindow");
    var userInput = $("#user-input");
    var userInputButton = $("#submit-button");
    var spyOrNotBox = $("#spyOrNotBox");

    //for demo purposes
    function assignToLocalStorage(userName) {
        for (var i = 1; i <= playerLimit; i++) {
            if (!localStorage.getItem(i)) {
                localStorage.setItem(i, userName);
                users.push(userName);
                console.log(localStorage.getItem(i));
                break;
            }
        }     
    }

    // The next three funtions are for selecting gameplay.  They display users and locations as buttons,
    // select a spy and a first questioner, and handle questions between users

    function displayUsersAndLocation() {
        users.forEach(function (name) {
            displayUsers.append("<button>" + name + "</button>");
        });
        locations.forEach(function (loc) {
            displayLocations.append("<button>" + loc + "</button>");
        })
    }

    function spySelector() {
        var spy = users[Math.floor(Math.random() * users.length)];
        userRoles[spy] = "Spy";
        users.forEach(function (user) {
            if (user != spy) {
                userRoles[user] = "Good guy";
                spyOrNotBox.append("Good Guy");
            }
        })
        // selects first questioner
        var questionerSelector = users[Math.floor(Math.random() * users.length)];
        questioner = userRoles[questionerSelector];
    }

    //allows selected user to direct questions at another individual for a given round
    function userQuestions() {
        // loops until time has passed or round has ended by successful choice
        setInterval()
        for (var i = 1; i < users.length; i++) {
            // put if statement here for user current questioner
            userInputButton.on("click", function () {
                chatBox.append(userInput.val().trim());

                questionSubmitted = true;
                // put if statement questionSubmitted = true and user input is from responder
                if (questionSubmitted) {
                    userInputButton.on("click", function () {
                        chatBox.append(userInput.val().trim());
                        questionSubmitted = false;
                        //need to add variable here that will assign questioner variable to responder
                    })
                };
            });
        }
    }

    function 

    //Functions listed below are for starting game, restarting game, 

    // assigns user input to user name, stores it into local storage(for demo purposes), and 
    // will later store it in object using firebase
    userInputButton.on("click", function () {
        event.preventDefault();
        $("label[for='user-input']").text("Type question or response here");
        var userName = userInput.val().trim();
        assignToLocalStorage(userName);
        startRound();
    })

    function startRound() {
        selectedLocation = Math.round(Math.random() * locations.length);
        spySelector();
        displayUsersAndLocation();
    }

    function nextRound(){
        round++;
        if (round > 5) {
            endGame();
        }
        roundNumber.text("Round: " + round);
        // selects new group of "good guys" and "spies"
        startRound();    
    }

    function restartGame() {
        userRoles = {};
        users = [];
        round = 1;
    }

    //will display user scores to chatBox.  I need code for acessing firebase for appending scores.
    function endGame(){
        chatBox.append();
    }
});
