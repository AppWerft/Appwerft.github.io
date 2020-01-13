$(document).ready(onReady);

function onReady() {
	$.getJSON('./projekte.json',function(json){
		document.title = json.title;
		$('h1').text(json.title);
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