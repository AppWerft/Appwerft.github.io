$(document).ready(onReady);

function onReady() {
	console.log('mmmm');
	$.getJson('./projekte.json',function(json){
		console.log(json);
	});

});