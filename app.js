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
	['cordova','Titanium','Android','iOS','reactNative'].forEach(function(k){
		if (item.technik.indexOf(k)>-1) 
		$('#icons_'+ndx).append('<img src="assets/'+k.toLower()+'.png" height="30"/>')
	});
	if (item.technik.indexOf('cordova')>-1) 
		$('#icons_'+ndx).append('<img src="assets/cordova.png" height="30"/>')
	if (item.technik.indexOf('Titanium')>-1) 
		$('#icons_'+ndx).append('<img src="assets/titanium.png" height="30"/>')
	if (item.technik.indexOf('Android')>-1) 
		$('#icons_'+ndx).append('<img src="assets/android.png" height="30"/>')	
	if (item.technik.indexOf('iOS')>-1) 
		$('#icons_'+ndx).append('<img src="assets/ios.png" height="30"/>')	
	if (item.technik.indexOf('reactNative')>-1) 
		$('#icons_'+ndx).append('<img src="assets/reactnative.png" height="30"/>')				
}

$(document).ready(onReady);