$(document).ready(onReady);

function onReady() {
	console.log('mmmm');
	$.getJSON('./projekte.json',function(json){
		$(body).append('<h1>'+json.title+'</h1>');
	});

};