$(document).ready( function () {
    var config = {
        apiKey: "AIzaSyAQbtznyx7eg2s-4qn_cDDiKU-VmmGhecI",
        authDomain: "spyfall-1fe22.firebaseapp.com",
        databaseURL: "https://spyfall-1fe22.firebaseio.com",
        projectId: "spyfall-1fe22",
        storageBucket: "spyfall-1fe22.appspot.com",
        messagingSenderId: "1078600510586"
      };
      firebase.initializeApp(config);
    
    // Get a reference to the database service
    var database = firebase.database();
    
      $(".submit").on('click', function(){
          var userInput= $(".userMessage").val().trim(); 
          console.log(userInput); 
          database.ref('chatlog').set({
            message: userInput
          });

      } ) 

        // Using .on("value", function(snapshot)) syntax will retrieve the data
    // from the database (both initially and every time something changes)
    // This will then store the data inside the variable "snapshot". We could rename "snapshot" to anything.
    database.ref('chatlog').on("value", function(snapshot) {

       
        console.log(snapshot.val());
  
        
        $(".chatbox").append("<p> "+ snapshot.val().message +" </p>"); 
  
       
       
  
      
      }, function(errorObject) {
  
      
        console.log("The read failed: " + errorObject.code);
      });
    





} ) 

//Notes:
//It seems firebase only keeps track of the last message submitted. Can you change it to keep a log of messages?
//Now that the players app is complete, try to incorporate the ability to only allow the player who's turn it is to submit a message.
//I already did this but ensure all messages are stored in the 'chatlog' tree of firebase db, otherwise it will overwrite the game data.
//Other than that great work! I had fun talking smack to myself over chat.




