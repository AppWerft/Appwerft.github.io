var start = new Date().getTime();

function Log(text) {
	var now = new Date().getTime();
	console.log((now - start) + ' ' + text);
	start = now;
}

Log(start);
window.onload = function () {
	this.Log('onload');
	this.Drawer = $('.drawer').drawer();
	const Map = new L.Map('unfallkarte', {
		center: new L.LatLng(53.5562788, 9.985348),
		zoom: 14,
		layers: []
	});
	L.tileLayer.wms(
		'https://geodienste.hamburg.de/HH_WMS_DOP?', {
		service: 'WMS',
		version: '1.3.',
		request: 'GetMap',
		format: 'image/jpeg',
		transparent: 'true',
		layers: 1,
		width: 512,
		height: 512,
		opacity: 0.9,
		crs: L.CRS.EPSG25832
	}).addTo(Map);

	var heatmapLayer = new HeatmapOverlay({
		"radius": 8,
		max: 10,
		"maxOpacity": 1,
		"scaleRadius": false,
		"useLocalExtrema": true,
		valueField: 'count',
		latField: 'lat',
		lngField: 'lng',
	});
	Map.addLayer(heatmapLayer);
	const UnfallLayer = new Unfälle(heatmapLayer);
	Log('addL')


	const kategorien = { '1': "leicht", '2': "schwer", '3': "Tod (endgültig)" };
	Object.keys(kategorien).forEach(function (id) {
		$('#ukategorie').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + id + '"><span class="slider round"></span></label><legend>' + kategorien[id] + '</legend></li>')
	});


	const beteiligte = { IstRad: 'Fahrrad', IstPKW: 'Personenkraftwagen', IstFuss: 'Fußgänger', IstKrad: 'Kraftrad', IstGkfz: 'Lastkraftwagen', IstSonstig: 'Sonstiges' };
	Object.keys(beteiligte).forEach(function (item) {
		$('#beteiligung').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + item + '"><span class="slider round"></span></label><legend>' + beteiligte[item] + '</legend></li>')
	});
	setTimeout(function() {
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
						value: wochentage[i+1]
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
	}, 2000);
	setTimeout(function() {
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
						value: monate[i+1]
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
	}, 2000);

	
	$('#beteiligung input').on('change', function () {
		const self = $(this);
		UnfallLayer.setFilter(self.attr('name'), self.is(':checked'))
	});
	$('#wochentage input').on('change', function () {
		const self = $(this);
		UnfallLayer.setFilter(self.attr('name'), self.is(':checked'))
	});
	L.Control.Watermark = L.Control.extend({
		onAdd: function (map) {
			var img = L.DomUtil.create('img');

			img.src = 'https://upload.wikimedia.org/wikipedia/commons/5/52/Hamburg-logo.svg';
			img.style.width = '320px';

			return img;
		},

		onRemove: function (map) {
			// Nothing to do here
		}
	});

	L.control.watermark = function (opts) {
		return new L.Control.Watermark(opts);
	}

	L.control.watermark({ position: 'bottomleft' }).addTo(Map);
};


