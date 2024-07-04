var userClickedPattern = [];
var gamePattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var level = 0;
var start = false;
var answer = true;

$(document).keypress(function() {
  if (!start) {
    $("#level-title").html("Level " + level);
    nextSequence();
    start = true;
  }
});

$(".btn").click(handler);

function handler() {
  if(answer==true){
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
  }
}

function nextSequence() {
  answer = true;
  userClickedPattern = [];
  level++;
  $("#level-title").html("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  $("#" + randomChosenColour).fadeOut(100).fadeIn();
  playSound(randomChosenColour);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    answer = true;
  }
  else{
      answer=false;
      playSound("wrong");
      $("#level-title").html("Press A Key To Start");
      $("body").addClass("game-over");
      setTimeout(function() {
        $("body").removeClass("game-over");
      }, 100);
      start=false;
      level=0;
      gamePattern=[];
  }
  if ((currentLevel == gamePattern.length - 1) && answer == true) {
    setTimeout(function() {
      nextSequence();
    }, 1000);
  }
}
