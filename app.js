$(document).ready(onReady);

function onReady() {
	console.log('mmmm');
	$.getJSON('./projekte.json',function(json){
		console.log(json);
	});

};