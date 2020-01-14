function onReady() {
	$.getJSON('./projekte.json',function(model){
		document.title = model.title;
		$('h1').text(model.title).prepend('<img id="avatar" src="'+model.avatar+'" />');
		model.items.map(renderItem);
		$("#accordion").accordion({collapsible: true, active: false, heightStyle: "content"});
	});
};


function renderArticle(item,ndx) {
	return '<dl>'
		+ '<dt>Projekt:</dt><dd>'+item.inhalt+'</dd>'
	 	+ '<dt>Rolle:</dt><dd>'+item.rolle+'</dd>'
	  	+ '<dt>Layout/Design:</dt><dd>'+item.layoutdesign+'</dd>'
	  	+ '<dt>Auftraggeber:</dt><dd>'+item.auftraggeber+'</dd>'
	  	+ '</dl>';
}
  
function renderItem(item,ndx) {
	$('#accordion').append('<h3>'+item.projekt+'<div style="float:right" id="icons_'+ndx+'"></div></h3><div>' +renderArticle(item,ndx)+'</div>');
	const langs = item.technik.split(/,\s+/);
	['WindowsXP','PHP','mySQL','Cordova','JSP','Java','ES6','ObjectiveC','Titanium','Android','iOS','ReactNative','Javascript'].forEach(function(k){
		if (langs.indexOf(k)>-1) $('#icons_'+ndx).append('<img src="assets/'+k.toLowerCase()+'.png" height="24"/>')
	});
}

$(document).ready(onReady);