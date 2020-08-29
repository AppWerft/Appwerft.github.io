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
		opacity: 0.99,
		attribution: 'Kartenkacheln von Landesbetrieb für Geoinformation und Vermessung der Freien und Hansestadt Hamburg',

	});
	Map = new L.Map('unfallkarte', {
		center: new L.LatLng(50, 55),
		zoom: 4,
		minZoom: 3,
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
		var px = Map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
		px.y -= e.target._popup._container.clientHeight*0.5; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
		Map.panTo(Map.unproject(px),{animate: true}); // pan to new center
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
					iconUrl: './ah.png',
					iconSize: [33, 22],
					iconAnchor: [16,11],
					popupAnchor: [0, 0]
				});
				var img = 'tx_userahwerke/' + encodeURI(w.img)
				var text = w.text || '';
				var content = '<b>' + w.name + '</b><br/>'+text+'</br><a data-fancybox="gallery" href="'+img+'"><img src="'+img+'" /></a>';
				L.marker(latlng, { icon: ahicon }).addTo(Map).bindPopup(content).bindTooltip(w.name);
			}
		});
	}
	$.getJSON('werke.json?445', onWerkeLoad);
	var hammertime = new Hammer(document.getElementsByClassName('drawer-menu')[0], {});
	hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
	hammertime.on('swipe', function (ev) {
		$('.drawer').drawer('close');
	});
	L.Control.Watermark = L.Control.extend({
		onAdd: function (map) {
			var img = L.DomUtil.create('img');
			img.src = '07-vita.jpg';
			img.style.width = '240px';
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
