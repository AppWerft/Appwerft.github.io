$(document).ready(onReady);

function onReady() {
	$.getJSON('./projekte.json',function(json){
		document.title = json.title;
		$('h1').text(json.title);
		var icons = {
      header: "ui-icon-circle-arrow-e",
      activeHeader: "ui-icon-circle-arrow-s"
    };
     $( "#accordion" ).accordion({
       icons: icons
    });
		json.items.forEach(renderItem)
	});
	

};

function renderItem(item) {
		
		$('#accordion').append('<h3>'+item.projekt+'</h3><div>'+ JSON.stringify(item)+'</div>');

}