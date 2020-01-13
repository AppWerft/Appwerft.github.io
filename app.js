$(document).ready(onReady);

function onReady() {
	var icons = {
           header: "ui-icon-circle-arrow-e",
           activeHeader: "ui-icon-circle-arrow-s"
        };
        $("#accordion").accordion({
          
           active: 1,
           collapsible: true
        });
	$.getJSON('./projekte.json',function(json){
		document.title = json.title;
		$('h1').text(json.title);
		
		json.items.forEach(renderItem)
	});
};

function renderItem(item) {
		
		$('#accordion').append('<h3>'+item.projekt+'</h3><div>'+ JSON.stringify(item)+'</div>');

}