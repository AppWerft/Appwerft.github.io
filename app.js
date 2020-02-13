function onReady() {
	const opts = getOpts();
	$.getJSON('./projekte.json',function(model){
		document.title = model.title;
		$('h1').text(model.title).prepend('<img id="avatar" src="'+model.avatar+'" />');
		var projects = [];
		if (opts['projects']) {
			opts['projects'].split(',').forEach(function(id) {
				projects.push(getProjectById(model.items,id));		
			});
			projects.push(getOtherProjects(model.items,opts['projects'].split(',')));
		} else projects = model.items;
		projects.map(renderItem);
		$("#accordion").accordion({collapsible: true, active: false, heightStyle: "content"});
		$('[title!=""]').qtip({position: {my: 'top right', at: 'bottom right'},style: { classes: 'qtip-dark qtip-shadow'}});
		
		if (opts["expanded"]) 
			$(".ui-accordion-content").show();
	});
};

function getOtherProjects(projects,ids) {
	return projects.filter(function(p){
			return ids.inludes(p.id) ? false : true;
	});
}

function getProjectById(projects,id) {
	return projects.filter(function(p){
		return p.id==id ? true: false;
	})[0];
}

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

function renderItem(item,ndx) {
	if (!item) return;
	$('#accordion').append('<h3>'+item.projekt+'<div style="float:right" id="icons_'+ndx+'"></div></h3><div>' +renderArticle(item,ndx)+'</div>');
	const langs = item.technik.split(/,\s+/);
	['CPP','Tesseract','Solr','TYPO3','Firebase','OpenCV','FFmpeg','HTML5','Bluetooth','WindowsXP','PHP','mySQL','Cordova','JSP','Java','ES6','ObjectiveC','Titanium','Android','iOS','ReactNative','Javascript'].forEach(function(k){
 		if (langs.indexOf(k)>-1) $('#icons_'+ndx).append('<img title="Eingesetzte Technik:\n'+k+'" src="assets/'+k.toLowerCase()+'.png" />')
	});
}
function getOpts() {
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

$(document).ready(onReady);