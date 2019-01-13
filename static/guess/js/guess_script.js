var number_of_digits = parseInt($('#number_of_digits').val(), 10);
var true_number = 0;
var game_started = false;
var game_over = false;
var guess_number = 1;

$("#decrease").click(function() {
  if(number_of_digits > 1){
    number_of_digits -= 1;
  }
  $('#number_of_digits').attr("value", number_of_digits)
});

$("#increase").click(function() {
  if(number_of_digits < 9){
    number_of_digits += 1;
  }
  $('#number_of_digits').attr("value", number_of_digits);
});

function generateRandomNumber(){
  var nums = [];
  var number = "";
  while(nums.length < number_of_digits){
    var num = Math.floor(Math.random() * 9) + 1;
    if(!nums.includes(num)){
      nums.push(num);
      number += num.toString();
    }
  }
  number = parseInt(number, 10);
  return number;
}

function valid_guess(guess){
  var guess_arr = guess.toString().split('')

  if(guess_arr.includes("0")){return false;}
  if(guess_arr.length != number_of_digits){return false;}

  for(var i=0; i<guess_arr.length-1; i++){
    for(var j=i+1; j<guess_arr.length; j++){
      if(guess_arr[i]==guess_arr[j]){
        return false;
      }
    }
  }
  return true;
}

function evaluate_guess(guess){
  var guess_arr = guess.toString().split('');
  var true_arr = true_number.toString().split('');
  var result_pos = 0;
  var result_neg = 0;

  for (var i = 0; i < guess_arr.length; i++) {
    if(true_arr.includes(guess_arr[i])){
      if(true_arr[i]==guess_arr[i]){
        result_pos += 1;
      } else {
        result_neg += 1;
      }
    }
  }

  result_pos = "+" + result_pos.toString();
  result_neg = "-" + result_neg.toString();

  return result_pos + " " + result_neg
}

$('#start').click(function(){
  true_number = generateRandomNumber();
  game_started = true;
  game_over = false;
  guess_number = 1;
  $('#logs').empty();
  $('#logs').append('Game has started... Begin guessing! Good luck!');
  $('#logs').append('<br>');
});

$('#guess').click(function(){
  if(game_started && !game_over){
    var guess = parseInt(prompt("Please enter your guess:"))

    while(!valid_guess(guess)){
      guess = prompt("Your guess is not valid, please enter again:");
    }

    if(guess != true_number){
      $('#logs').append(guess_number + '. Your guess is: ' + guess + " ---> feedback: " + evaluate_guess(guess));
      $('#logs').append('<br>');
      guess_number += 1;
    } else {
      game_over = true;
      $('#logs').append(guess_number + '. Your guess is: ' + guess + " Congragulations!");
    }

  } else {
    alert("Please start the game before making any guess!")
  }
});
