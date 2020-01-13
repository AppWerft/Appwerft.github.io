$( document ).ready(function() {
	$.getJson('./projekte.json',function(json){
		console.log(json);
	});

});