var grid_size;
var number_of_grid;
var adversary_route;
var adversary_entry_exit_grids;
var value_of_route;
var max_move;
var grid_values;

var is_game_started = false;

function initialize_globals(){
  grid_size = 0;
  number_of_grid = 0;
  adversary_route = [];
  grid_values = [];
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
		generate_grid_values(1, 10, 5);
    populate_game_info_panel()
    $('#game').css('visibility', "visible");
    $('#newGameModal').modal("hide");
    is_game_started = true;
	} else {
		alert("Grid system or number of rounds not selected!");
	}
});

$('#submit-route').click(function(){
  if(is_valid_route(adversary_route)){
    var route = "";
    for (var i = 0; i < adversary_route.length; i++) {
      route += "(" + adversary_route[i] + ") ";
    }
    alert("You selected the following route: \n" + route);
  } else {
    alert("Selected route is not valid! Please try again by reselecting a route!")
  }
})

$('#reselect-route').click(function(){
	clear_route();
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
	document.getElementById('route').innerHTML = '';
  document.getElementById('route_info').innerHTML = "Route Info | Value of the route: " + 0;
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
		case '5x5':
		  grid_size = 100;
		  number_of_grid = 5;
      max_move = 10;
		  break;
		case '10x10':
		  grid_size = 50;
		  number_of_grid = 10;
      max_move = 20;
		  break;
		case '15x15':
		  grid_size = 32.5;
		  number_of_grid = 15;
      max_move = 40;
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
    value_of_route += parseInt($(button).val());
		adversary_route.push(button.id);
		$(button).css('background-color', "lightpink");
		document.getElementById('route').innerHTML += draw_route_button(button.id);
    document.getElementById('route_info').innerHTML = "Selected Route | Value of the route: " + value_of_route;
	} else {
		alert("Please initialize the game first!");
	}

};

function draw_route_button(name){
	return '<input class="btn btn-default btn-xs" type="button" value="(' + name + ')" style="width:60px; height:25px; font-size: 12px; border: 1px solid black; background-color:white; color:black; line-height:10px; text-align:center;" disabled>'
}

function get_row(grid){
  return grid.split(",")[0];
}

function get_col(grid){
  return grid.split(",")[1];
}

function route_status(route){
	if(is_valid_route(route)){
		return "VALID";
	} else {
		return "NOT VALID";
	}
}

function generate_grid_values(a, b, c){
	for (var i = 0; i < number_of_grid; i++) {
		for (var j = 0; j < number_of_grid; j++) {
			var value;
			F = (c - a) / (b - a);
			var rand = Math.random();
			if (rand < F) {
				val = a + Math.sqrt(rand * (b - a) * (c - a));
			} else {
				val = b - Math.sqrt((1 - rand) * (b - a) * (b - c));
			}
			$('td > .btn').get(i*number_of_grid+j).setAttribute("value", Math.floor(val));
			grid_values.push(Math.floor(val))
		}
	}
}

function is_valid_route(route){
  if(adversary_route.length > max_move){return false;}
  if(!adversary_entry_exit_grids.includes(route[0])){return false;}
  if(!adversary_entry_exit_grids.includes(route[route.length-1])){return false;}
  for (var i = 0; i < adversary_route.length - 1; i++) {
    var current_grid_row = get_row(adversary_route[i]);
    var current_grid_col = get_col(adversary_route[i]);
    var next_grid_row = get_row(adversary_route[i+1]);
    var next_grid_col = get_col(adversary_route[i+1]);
    if(Math.abs(current_grid_row-next_grid_row) + Math.abs(current_grid_col-next_grid_col) > 1){return false;}
  }
  return true;
}
