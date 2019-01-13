var grid_size;
var number_of_grid;
var adversary_route;
var adversary_entry_exit_grids;
var value_of_route;
var max_move;
var grid_values;
var patrol_route;
var patrol_url = "patrol_route/"

var is_game_started = false;

function initialize_globals(){
  grid_size = 0;
  number_of_grid = 0;
  adversary_route = [];
  grid_values = '';
  adversary_entry_exit_grids = [];
  value_of_route = 0;
}

$('#new_game').click(function(){
  clear_new_game_panel();
});

$('#start_game').click(function(){
	if(is_grid_system_selected() && is_number_of_rounds_selected()){
    clear_route();
    initialize_globals();
    $('#grid_layout').html(generate_grid_system());
		generate_grid_values();
    populate_game_info_panel();
    refresh_game_info()
    $('#game').css('visibility', "visible");
    $('#newGameModal').modal("hide");
    is_game_started = true;
	} else {
		alert("Grid system or number of rounds not selected!");
	}
});

$('#submit-route').click(function(){
  if(is_route_submission_valid()){
    var route = "";
    for (var i = 0; i < adversary_route.length; i++) {
      route += "(" + adversary_route[i] + ") ";
    }
    alert("You selected the following route: \n" + route);
  }
})

$('#reselect-route').click(function(){
	clear_route();
})

$('#patrol-route').click(function(){
  patrol_route = []
  $.get(patrol_url, {'number_of_grid': number_of_grid, 'max_move': max_move, 'grid_values': grid_values}, function(data) {
    list = data.split(',')
    for(var i=0; i<list.length-1; i++){
      var grid_val = parseInt(list[i])
      var row = Math.floor(grid_val / number_of_grid);
      var col = grid_val % number_of_grid
      patrol_route.push(row + "," + col);
    }
    draw_patrol_route();
  });
})

$('#run-round').click(function(){
	if(!is_interdicted()){
    alert("Congragulations! You got " + value_of_route + " points without getting caught!");
  }
})

function populate_game_info_panel(){
  $('#_name').text($('#player_name').val());
  $('#_grid').text($('#grid_system').val());
  $('#_round').text($('#number_of_rounds').val());
  $('#max_move').text(max_move);
}

function clear_route(){
	adversary_route = [];
  value_of_route = 0;
	$('td > .btn').css('background-color', "lightblue");
	refresh_game_info();
}

function refresh_game_info(){
  document.getElementById('current_value').innerHTML = 0;
  document.getElementById('remaining_moves').innerHTML = max_move;
}

function clear_new_game_panel(){
  document.getElementById("player_name").value = "";
  document.getElementById("grid_system").selectedIndex = "0";
  document.getElementById("number_of_rounds").value = "";
}

function is_grid_system_selected(){
	if($('#grid_system option:selected').text()=="select"){
		return false;
	}
	return true;
}

function is_number_of_rounds_selected(){
	if(($('#number_of_rounds').val()=="") || ($('#number_of_rounds').val()==null)){
		return false;
	}
	return true;
}

function generate_grid_system(){

	switch ($('#grid_system option:selected').text()) {
		case '8x8':
		  grid_size = 70;
		  number_of_grid = 8;
      max_move = 15;
		  break;
		case '10x10':
		  grid_size = 55;
		  number_of_grid = 10;
      max_move = 20;
		  break;
		case '12x12':
		  grid_size = 42.5;
		  number_of_grid = 12;
      max_move = 25;
		  break;
		default:
	}

	text = '<table class="area">'

	// add numbers on top
	text += '<tr><td></td>';
	for (var i = 0; i < number_of_grid; i++) {
		text += '<td style="color:red; text-align:center; font-weight:bold; font-family:cursive;">' + i + '</td>';
	}

	text += '</tr>';

	// generate grid layout
	for (var i = 0; i < number_of_grid; i++) {
		text += '<tr>';
		text += '<td style="color:red; text-align:center; font-weight:bold; font-family:cursive;">' + i + '></td>';
			for (var j = 0; j < number_of_grid; j++) {
				text += '<td><input id="' + i + ',' + j + '" type="button" onclick="draw_route(this)" class="btn btn-primary" style="width: ' + grid_size + 'px; height: ' + grid_size + 'px"></td>'
			}
		adversary_entry_exit_grids.push(i + "," + 0);
		text += '</tr>'
	}

	text += '</table>'

	return text
}

function draw_route(button){
	if(is_game_started){

    if(is_valid_route(button)){
      value_of_route += parseInt($(button).val());
  		adversary_route.push(button.id);
      $(button).css('background-color', "lightpink");
      // document.getElementById('route').innerHTML += draw_route_button(button.id);
      document.getElementById('current_value').innerHTML = value_of_route
      document.getElementById('remaining_moves').innerHTML = max_move-adversary_route.length;
    }

	} else {
		alert("Please initialize the game first!");
	}

};

function draw_patrol_route(){
  for (var i=0; i<patrol_route.length; i++) {
    var id = patrol_route[i];
    if(document.getElementById(id).style.backgroundColor=="lightpink"){
      document.getElementById(id).style.backgroundColor = "lightyellow";
    } else{
      document.getElementById(id).style.backgroundColor = "lightgreen";
    }
  }
}

// function draw_route_button(name){
// 	return '<input class="btn btn-default btn-xs" type="button" value="(' + name + ')" style="width:60px; height:25px; font-size: 12px; border: 1px solid black; background-color:white; color:black; line-height:10px; text-align:center;" disabled>'
// }

function get_row(grid){
  return grid.split(",")[0];
}

function get_col(grid){
  return grid.split(",")[1];
}

function route_status(){
	if(is_valid_route()){
		return "VALID";
	} else {
		return "NOT VALID";
	}
}

function generate_grid_values(){
	for (var i = 0; i < number_of_grid; i++) {
		for (var j = 0; j < number_of_grid; j++) {
      var lower = Math.floor(number_of_grid / 4);
      var upper = Math.ceil(number_of_grid / 4 + number_of_grid / 2);
      var value_to_add_on_grid;
      if(i>=lower && i<upper && j>=lower && j<upper){
        value_to_add_on_grid = generate_triangular_random(6, 10, 7);
      } else {
        value_to_add_on_grid = generate_triangular_random(1, 5, 1);
      }
			$('td > .btn').get(i*number_of_grid+j).setAttribute("value", value_to_add_on_grid);
			grid_values += Math.floor(val) + ','
		}
	}
}

function generate_triangular_random(a, b, c){
  var value;
  var rand = Math.random();

  F = (c - a) / (b - a);

  if (rand < F) {
    val = a + Math.sqrt(rand * (b - a) * (c - a));
  } else {
    val = b - Math.sqrt((1 - rand) * (b - a) * (b - c));
  }

  return Math.floor(val);
}

function is_route_submission_valid(){
  if(!adversary_entry_exit_grids.includes(adversary_route[adversary_route.length-1])){
    alert('You need to end in certain grids explained above!');
    return false;
  }
  return true;
}

function is_valid_route(button){

  if(adversary_route.length+1 > max_move){alert('You can make max ' + max_move + " moves! Please reselect your route!"); return false;}
  if(adversary_route.includes(button.id)){alert('You have already passed on this grid!'); return false;}

  if(adversary_route.length == 0){
    if(!adversary_entry_exit_grids.includes(button.id)){alert('You need to start from certain grids explained above!'); return false;}
  } else {
    var current_grid_row = get_row(adversary_route[adversary_route.length-1]);
    var current_grid_col = get_col(adversary_route[adversary_route.length-1]);
    var next_grid_row = get_row(button.id);
    var next_grid_col = get_col(button.id);
    if(Math.abs(current_grid_row-next_grid_row) + Math.abs(current_grid_col-next_grid_col) > 1){
      alert('You can only move to neighbor grids!');
      return false;
    }
  }

  return true;
}

function is_interdicted(){
  // no need to compare the last moves since they have to end up with different grids to make the route valid
  // the length of the adversary_route will always be less than or equals to patrol_route, thus loop reaches up to adversary_route length
  for (var i = 0; i < adversary_route.length - 1; i++) {
    if(adversary_route[i] == patrol_route[i]){
      alert("You caught on arriving the same grid!")
      return true;
    }
    if(adversary_route[i]==patrol_route[i+1] && adversary_route[i+1]==patrol_route[i]){
      alert("You caught on moving the same egde!")
      return true;
    }
  }
  return false;
}
