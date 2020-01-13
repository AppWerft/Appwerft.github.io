function onReady() {
	
   
	$.getJSON('./projekte.json',function(model){
		model.items.map(renderItem);
		document.title = model.title;
		$('h1').text(model.title);
		$("#accordion").accordion({
           active: 1,
           collapsible: true
    	});
	});
};

function renderItem(item,ndx) {
	$('#accordion').append('<h3>'+item.projekt+'</h3><div id="slot_'+ndx+'">'+ JSON.stringify(item)+'</div>');

}

$(document).ready(onReady);