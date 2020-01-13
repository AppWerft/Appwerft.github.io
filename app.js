$(document).ready(onReady);

function onReady() {
	console.log('mmmm');
	$.getJSON('./projekte.json',function(json){
		$('body').append('<h1>'+json.title+'</h1><div id="accordion"></div>');
		json.items.forEach(renderItem);
	});
	var icons = {
      header: "ui-icon-circle-arrow-e",
      activeHeader: "ui-icon-circle-arrow-s"
    };
        $( "#accordion" ).accordion({
      icons: icons
    });

};

function renderItem(item) {
		console.log(item);
		$('body').append('<article><h2>'+item.projekt+'</h2></article>');

}