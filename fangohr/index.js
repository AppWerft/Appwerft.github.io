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
	
	const grayLayer = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB?', {
		layers: '6,10,18,26,2,14,22,30',
	
		crs: L.CRS.EPSG25832,
		format: 'image/png',
		transparent: 'true',
		service: 'wms',
		maxZoom: 18,
		minZoom: 10,
		cacheid : new Date().getTime(),
		version: '1.3.0',
		attribution: 'Kartenkacheln von Landesbetrieb für Geoinformation und Vermessung der Freien und Hansestadt Hamburg',

	}),
	photoLayer = L.tileLayer.wms(
		'https://geodienste.hamburg.de/HH_WMS_DOP?', {
		service: 'WMS',
		version: '1.3.',
		request: 'GetMap',
		format: 'image/jpeg',
		transparent: 'true',
		layers: 1,
		width: 512,
		height: 512,
		opacity: 1,
		crs: L.CRS.EPSG25832
	});
	var heatmapLayer = new HeatmapOverlay({
		"radius": 8,
		"max": 10,
		"maxOpacity": 1,
		"scaleRadius": false,
		"useLocalExtrema": true,
		"valueField": 'count',
		"latField": 'lat',
		"lngField": 'lng',
	});
	Map = new L.Map('unfallkarte', {
		center: new L.LatLng(53.5562788, 9.995348),
		zoom: 14,
		minZoom: 12,
		zoomControl: false,
		attributionControl: false,
		cursor: true,
		layers: [grayLayer,photoLayer]
	});
	Map.addLayer(heatmapLayer);
	
	L.control.layers({
		"Graublaukarte": grayLayer,
		"Photo": photoLayer
	}).addTo(Map);

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

	Map.on('click', function (ev) {
		var latlng = Map.mouseEventToLatLng(ev.originalEvent);

		//const msg = ;
		const event = UnfallLayer.getNearestUnfall(latlng.lat, latlng.lng);
		popup = L.popup()
			.setLatLng(L.latLng(event.YGCSWGS84, event.XGCSWGS84))
			.setContent(renderEvent(event));

		Map.openPopup(popup);
	});

	const UnfallLayer = new Unfälle(heatmapLayer);

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
		Map.on('zoomstart', function () {
			UnfallLayer.hide();
		})
		Map.on('zoomend', function () {
			UnfallLayer.show();
		})
	}
	const kategorien = { '1': "Getötete", '2': "Schwerverletzte", '3': "Leichtverletzte" };
	Object.keys(kategorien).forEach(function (id) {
		$('#kategorie').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + id + '"><span class="slider round"></span></label><legend>' + kategorien[id] + '</legend></li>')
	});


	const beteiligte = { IstRad: 'Fahrrad', IstPKW: 'Personenkraftwagen', IstFuss: 'Fußgänger', IstKrad: 'Kraftrad', IstGkfz: 'Lastkraftwagen', IstSonstig: 'Sonstiges' };
	var filter = UnfallLayer.getFilter();
	Object.keys(beteiligte).forEach(function (item) {
		$('#beteiligung').append('<li class="drawer-menu-item"><label class="switch"><input ' + (filter[item] ? 'checked' : '') + ' type="checkbox" name="' + item + '"><span class="slider round"></span></label><legend>' + beteiligte[item] + '</legend></li>')
	});
	
	/*
	setTimeout(function () {
		var wochentage = UnfallLayer.getTotal('UWOCHENTAG');
		var pie = new d3pie('wochentage', {
			size: {
				canvasHeight: 240,
				canvasWidth: 240
			},
			data: {
				content: 'Mo Di Mi Do Fr Sa So'.split(' ').map(function (tag, i) {
					return {
						label: tag,
						value: wochentage[i + 1]
					}
				})
			},
			callbacks: {
				onMouseoverSegment: function (info) {
					
				},
				onMouseoutSegment: function (info) {
				}
			}
		});
	}, 200);
	setTimeout(function () {
		var monate = UnfallLayer.getTotal('UMONAT');

		var pie = new d3pie('monate', {
			size: {
				canvasHeight: 240,
				canvasWidth: 240
			},
			data: {
				content: 'Jan Feb März Apr Mai Juni Juli Aug Sept Okt Nov Dez'.split(' ').map(function (tag, i) {
					return {
						label: tag,
						value: monate[i + 1]
					}
				})
			},
			callbacks: {
				onMouseoverSegment: function (info) {
					console.log('mouse in', info);
				},
				onMouseoutSegment: function (info) {
				}
			}
		});
	}, 200);
    */
	$('#beteiligung input').on('change', function () {
		const self = $(this);
		UnfallLayer.setIst(self.attr('name'), self.is(':checked'))
	});
	$('#kategorie input').on('change', function () {
		const self = $(this);
		UnfallLayer.setKategorie(self.attr('name'), self.is(':checked'))
	});
	L.Control.Watermark = L.Control.extend({
		onAdd: function (map) {
			var img = L.DomUtil.create('img');
			img.src = 'https://upload.wikimedia.org/wikipedia/commons/5/52/Hamburg-logo.svg';
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
	var hammertime = new Hammer(document.getElementsByClassName('drawer-menu')[0], {});
	hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
	hammertime.on('swipe', function (ev) {
		$('.drawer').drawer('close');
	});
	Map.addControl(new L.Control.Fullscreen({
		title: {
			'false': 'View Fullscreen',
			'true': 'Exit Fullscreen'
		}
	}));

};

window.onload = onLoad;
const reverseGeocodeResult = function (res) {
	console.log('reverseGeocodeResult')

	const address = res.results[0].locations[0].street;
	onLoad(address)

}
