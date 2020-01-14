function onReady() {
	$.getJSON('./projekte.json',function(model){
		model.items.map(renderItem);
		document.title = model.title;
		$('h1').text(model.title);
		$("#accordion").accordion();
	});
};


function renderArticle(item,ndx) {
	return '<article><dl><dt>Projekt</dt><dd>'+item.projekt+'</dd></dl></article>';
}
  
function renderItem(item,ndx) {
	$('#accordion').append('<h3>'+item.projekt+'<div style="float:right" id="icons_'+ndx+'"></div></h3><div>' +renderArticle(item,ndx)+'</div>');
	const langs = item.technik.split(/,\s+/);
	['Cordova','JSP','Java','ES6','ObjectiveC','Titanium','Android','iOS','ReactNative','Javascript'].forEach(function(k){
		if (langs.indexOf(k)>-1) $('#icons_'+ndx).append('<img src="assets/'+k.toLowerCase()+'.png" height="24"/>')
	});
}

$(document).ready(onReady);