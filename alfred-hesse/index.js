var start = new Date().getTime();
const KEY = 'FMGaWW73F9BBqOZ4GlXlCpvM0aHK46Ud';
function Log(text) {
	var now = new Date().getTime();
	text && console.log((now - start) + ' ' + text);
	start = now;
}



var popup;
var Map;

const onLoad = function (address) {
	if (typeof address != 'object') {
		if (popup && Map) {
			popup.setContent(popup.getContent().replace('<!--ADDRESS-->', address));
		}
		return;
	}
	
	const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		format: 'image/png',
		attribution: 'Kartenkacheln von Landesbetrieb für Geoinformation und Vermessung der Freien und Hansestadt Hamburg',

	});
	
	Map = new L.Map('unfallkarte', {
		center: new L.LatLng(50, 55),
		zoom: 4,
		minZoom: 3,
		maxZoom: 8,
		zoomControl: false,
		attributionControl: false,
		cursor: true,
		layers: [topoLayer]
	});
	
	this.Drawer = $('.drawer').drawer({
		iscroll: {
			mouseWheel: true,
			preventDefault: false
		},
		showOverlay: true
	});

	this.Drawer.on('drawer.opened', function () {
		Map.closePopup(popup);
	});
	this.Drawer.on('drawer.closed', function () {
		Map.closePopup(popup);
	});

	
	const kategorien = { '1': "Aquarelle", '2': "Kreidezeichnungen", '3': "Kohlezeichnungen" };
	Object.keys(kategorien).forEach(function (id) {
		$('#kategorie').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + id + '"><span class="slider round"></span></label><legend>' + kategorien[id] + '</legend></li>')
	});
	function onWerkeLoad(data) {
		data.forEach(function(w){
			var marker = L.circle(w.gps.split(','),{
				color:'red',
				fillColor: '#f03',
				fillOpacity: 0.5,	
				radius: 40000
			}).addTo(Map).bindPopup('<p><b>'+w.name+'</b></p><img width="300" src="tx_userahwerke/'+w.img+'" />');	
    		
		});
	}

	$.getJSON('werke.json',onWerkeLoad);
	
	var hammertime = new Hammer(document.getElementsByClassName('drawer-menu')[0], {});
	hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
	hammertime.on('swipe', function (ev) {
		$('.drawer').drawer('close');
	});
	L.Control.Watermark = L.Control.extend({
		onAdd: function (map) {
			var img = L.DomUtil.create('img');
			img.src = 'ah.png';
			img.style.width = '360px';

			return img;
		},

		onRemove: function (map) {
			// Nothing to do here
		}
	});

	L.control.watermark = function (opts) {
		return new L.Control.Watermark(opts);
	}

	L.control.watermark({ position: 'bottomright' }).addTo(Map);

};

window.onload = onLoad;
const reverseGeocodeResult = function (res) {
	console.log('reverseGeocodeResult')

	const address = res.results[0].locations[0].street;
	onLoad(address)

}
