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
          database.ref().set({
            message: userInput
          });

      } ) 

        
    database.ref().on("value", function(snapshot) {

       
        console.log(snapshot.val());
  
        
        $(".chatbox").append("<p> "+ snapshot.val().message +" </p>"); 
  
       
       
  
      
      }, function(errorObject) {
  
      
        console.log("The read failed: " + errorObject.code);
      });
    





} ) 






