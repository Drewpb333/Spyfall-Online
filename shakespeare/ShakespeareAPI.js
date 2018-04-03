//#translate is equal to user input form
//#translate-button is equal to submit button in user input form
$("#translate").on("click", "#translate-button", function (event) {
    event.preventDefault();
    var userInput = $("#user-input").val().trim();

    // div where text will be appended
    var textDiv = $("#translated-text");
    //queryUrl with userInput variable.  No API key is necessary
    var queryUrl =
        "https://cors-anywhere.herokuapp.com/https://api.funtranslations.com/translate/shakespeare.json?text=" +
        userInput;
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        var translation = response["contents"]["translated"];
        textDiv.html("<p>" + translation + "</p>");
    });
})