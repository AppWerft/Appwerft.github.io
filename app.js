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
	$('#accordion').append('<h3>'+item.projekt+'<div style="float:right" id="icons_'+ndx+'"></div></h3><div id="slot_'+ndx+'">'+ JSON.stringify(item)+'</div>');
	if (item.technik.indexOf('cordova')>-1) 
		$('h3 div').append('<img src="assets/cordova.png" height="30"/>')
}

$(document).ready(onReady);