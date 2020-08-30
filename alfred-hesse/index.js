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
	const topoLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
		format: 'image/png',
		opacity: 0.89,
		attribution: 'Kartenkacheln von Landesbetrieb für Geoinformation und Vermessung der Freien und Hansestadt Hamburg',

	});
	Map = new L.Map('unfallkarte', {
		center: new L.LatLng(50, 15),
		zoom: 6,
		minZoom: 4,
		maxZoom: 8,
		zoomControl: false,
		attributionControl: false,
		cursor: false,
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
	Map.on('popupopen', function(e) {
		var px = Map.project(e.target._popup._latlng); 
		px.y -= e.target._popup._container.clientHeight*0.5; 
		Map.panTo(Map.unproject(px),{animate: true});
		Map.eachLayer(function(layer) {
			if(layer.options.pane === "tooltipPane") layer.removeFrom(Map);
		});
	});

	const kategorien = { '1': "Aquarelle", '2': "Kreidezeichnungen", '3': "Kohlezeichnungen" };
	Object.keys(kategorien).forEach(function (id) {
		$('#kategorie').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + id + '"><span class="slider round"></span></label><legend>' + kategorien[id] + '</legend></li>')
	});
	
	function onWerkeLoad(data) {
		data.forEach(function (w) {
			if (w.name) {
			var latlng = w.gps.split(',');
				var ahicon = L.icon({
					iconUrl: 'pin.png',//'tx_userahwerke/' + (encodeURI(w.img)).replace('.JPG','.png'),
					iconSize: [15, 26],
					iconAnchor: [7.5,13],
					popupAnchor: [0, 0]
				});
				var img = 'tx_userahwerke/' + encodeURI(w.img)
				var text = w.text || '';
				var content = '<b>' + w.name + '</b><br/>'+text+'</br><a data-fancybox="gallery" href="'+img+'"><img src="'+img+'" /></a><br><i>Copyright: Alfred-Hesse-Archiv';
				L.marker(latlng, { icon: ahicon }).addTo(Map).bindPopup(content).bindTooltip(w.name, {className: 'ahtt'});
			}
		});
	}
	$.getJSON('werke.json', onWerkeLoad);
	var hammertime = new Hammer(document.getElementsByClassName('drawer-menu')[0], {});
	hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
	hammertime.on('swipe', function (ev) {
		$('.drawer').drawer('close');
	});
	L.Control.Watermark = L.Control.extend({
		onAdd: function (map) {
			var img = L.DomUtil.create('img');
			img.src = 'u.png';
			img.style.width = '44vw';
			return img;
		},
		onRemove: function (map) {}
	});
	L.control.watermark = function (opts) {
		return new L.Control.Watermark(opts);
	}
	L.control.watermark({ position: 'topright' }).addTo(Map);
};

window.onload = onLoad;
