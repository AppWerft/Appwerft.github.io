function onReady() {
	$.getJSON('./projekte.json',function(model){
		document.title = model.title;
		$('h1').text(model.title).prepend('<img id="avatar" src="'+model.avatar+'" />');
		model.items.map(renderItem);
		$("#accordion").accordion({collapsible: true, active: false, heightStyle: "content"});
		$('[title!=""]').qtip({
		position: {
        my: 'top right', 
        at: 'bottom right' 
        
    	},
		
		style: { classes: 'qtip-dark qtip-shadow'}});
		console.log(getUrlVars());
		//$(".ui-accordion-content").show();
		
	});
};


function renderChallenges(challenge) {
     var table = '<table><tr><th>Herausforderung</th><th>Lösung</th></tr>';
     challenge.forEach(function(c){
     	table += ('<tr><td>'+c.c+'</td><td>'+c.s+'</td></tr>');
     });
     table += '</table>';
	 return table;	


}

function renderArticle(item,ndx) {
	var article = '<dl>'
		+ '<dt>Projekt:</dt><dd>'+item.inhalt+'</dd>'
	 	+ '<dt>Rolle:</dt><dd>'+item.rolle+'</dd>'
	  	+ (item.layoutdesign ? '<dt>Layout/Design:</dt><dd>'+item.layoutdesign+'</dd>':'')
	  	+ (item.herausforderungen ? '<dt>Herausforderung(en):</dt><dd>'+renderChallenges(item.herausforderungen)+'</dd>':'')
	  	+ '<dt>Auftraggeber:</dt><dd>'+item.auftraggeber+'</dd>'
	  	+ '</dl>';
	if (item.shots) {
		article += '<div class="shots">';
		item.shots.forEach(function(s) {
			article += ('<img class="small" title="Screenshot" src="shots/'+s+'" />');
		});
		article += '</div>';
		
	}
	if (item.Shots) {
		article += '<div class="shots">'; 
		item.Shots.forEach(function(s) {
			article += ('<img class="large" title="Screenshot" src="shots/'+s+'" />');
		});
		article += '</div>';
		
	}
	return article;
	  	
}
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
  
function renderItem(item,ndx) {
	$('#accordion').append('<h3>'+item.projekt+'<div style="float:right" id="icons_'+ndx+'"></div></h3><div>' +renderArticle(item,ndx)+'</div>');
	const langs = item.technik.split(/,\s+/);
	['Solr','TYPO3','Firebase','OpenCV','FFmpeg','HTML5','Bluetooth','WindowsXP','PHP','mySQL','Cordova','JSP','Java','ES6','ObjectiveC','Titanium','Android','iOS','ReactNative','Javascript'].forEach(function(k){
 		if (langs.indexOf(k)>-1) $('#icons_'+ndx).append('<img title="Eingesetzte Technik:\n'+k+'" src="assets/'+k.toLowerCase()+'.png" height="24"/>')
	});
}

$(document).ready(onReady);