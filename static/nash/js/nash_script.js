$('table').bind('contextmenu', function(e) {
    return false;
});

$('td > .btn[name=payoff]').mousedown(function(){
  switch (event.which) {
      case 1:
          $(this).attr("value", parseInt($(this).val())+1);
          break;
      case 2:
          var new_value = parseInt(prompt("Enter the value:"));
          $(this).attr("value", new_value+1);
      case 3:
          $(this).attr("value", parseInt($(this).val())-1);
          break;
      default:
          alert('No action!');
  }
})

$('#restart').click(function(){
  $('td > .btn[name=payoff]').attr("value", 0);
})

$('#strategy').click(function(){

})
