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

        // Then we console.log the value of snapshot
        console.log(snapshot.val());
  
        // Then we change the html associated with the number.
        $(".chatbox").append("<p> "+ snapshot.val().message +" </p>"); 
  
        // Then update the clickCounter variable with data from the database.
       
  
      // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
      // Again we could have named errorObject anything we wanted.
      }, function(errorObject) {
  
        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
      });
    





} ) 






