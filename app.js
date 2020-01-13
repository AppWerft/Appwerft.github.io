$(document).ready(onReady);

function onReady() {
	console.log('mmmm');
	$.getJSON('./projekte.json',function(json){
		$('body').append('<h1>'+json.title+'</h1>');
		json.items.forEach(renderItem);
	});

};

function renderItem(item) {
		console.log(item);
		$('body').append('<article><h2>'+item.projekt+'</h2></article>');

}