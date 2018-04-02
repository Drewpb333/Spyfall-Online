
var currentTimeDiv = document.getElementById("my_timer").innerHTML;
var timeArray = currentTimeDiv.split('');
// console.log('timeArray: ', timeArray);
var min = timeArray[0];
var firstSecInteger = timeArray[2];
var secondSecInteger = timeArray[3];

function timerFormat(){
    //changes when timer becomes 3:00 or 2:00 etc.
    if(firstSecInteger == '0' && secondSecInteger == '0'){
        min--;
        firstSecInteger = 5;
        secondSecInteger = 9;
        
    }
    //changes when timer become 2:40 or 2:50
    else if(secondSecInteger == '0'){
        firstSecInteger--;
        secondSecInteger = 9;
        // console.log(firstSecInteger + secondSecInteger);
    }
    else{
        secondSecInteger--;
    }
    var currentTime = min + ":" + firstSecInteger + secondSecInteger;
    document.getElementById('my_timer').innerHTML = currentTime;
    if ( currentTime === '0:00') {
        clearInterval (timer);
    }
}


    
var timer = setInterval( timerFormat, 1000);


