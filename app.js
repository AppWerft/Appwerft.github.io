function onReady() {

	
    $("#accordion").accordion({
           active: 1,
           collapsible: true
    });
	$.getJSON('./projekte.json',function(model){
		document.title = model.title;
		$('h1').text(model.title);
		
		model.items.map(renderItem);
	});
};

function renderItem(item) {
		
		$('#accordion').append('<h3>'+item.projekt+'</h3><div>'+ JSON.stringify(item)+'</div>');

}



$(document).ready(onReady);