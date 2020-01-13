function onReady() {
    
	$.getJSON('./projekte.json',function(json){
		document.title = json.title;
		$('h1').text(json.title);
		
		json.items.forEach(renderItem)
		$("#accordion").accordion({
           active: 1,
           collapsible: true
    });
	});
};

function renderItem(item) {
		
		$('#accordion').append('<h3>'+item.projekt+'</h3><div>'+ JSON.stringify(item)+'</div>');

}



$(document).ready(onReady);