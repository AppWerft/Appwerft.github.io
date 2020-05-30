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
	setTimeout(function () {
		$('.drawer').drawer('open');
		setTimeout(function () {
			$('.drawer').drawer('close');
		}, 4000);
	}, 3000);
	
	const beteiligung = { istRad: 'Fahrrad', IstPKW: 'Personenkraftwagen', IstFuss: 'Fußgänger' ,IstKrad:'Kraftrad',IstGkfz:'Lastkraftwagen',IstSonstig: 'Sonstiges'};
	Object.keys(beteiligung).forEach(function (item) {
		$('#beteiligung').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + item + '"><span class="slider round"></span></label><legend>' + beteiligung[item] + '</legend></li>')
	});
	'Montag Dienstag Mittwoch Donnerstag Freitag Samstag Sonntag'.split(' ').forEach(function (tag,i) {
		$('#wochentage').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + i + '"><span class="slider round"></span></label><legend>' + tag + '</legend></li>')
	});
	'Januar Februar März April Mai Juni Juli August September Oktober November Dezember'.split(' ').forEach(function (tag,i) {
		$('#monate').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + i + '"><span class="slider round"></span></label><legend>' + tag + '</legend></li>')
	});
	$('#beteiligung input').on('change',function(){
		const self = $(this);	
		UnfallLayer.setFilter(self.attr('name'),self.is(':checked'))
	});
	$('#wochentage input').on('change',function(){
		const self = $(this);	
		UnfallLayer.setFilter(self.attr('name'),self.is(':checked'))
	});
	L.Control.Watermark = L.Control.extend({
		onAdd: function(map) {
			var img = L.DomUtil.create('img');
			
			img.src = 'https://upload.wikimedia.org/wikipedia/commons/5/52/Hamburg-logo.svg';
			img.style.width = '320px';
			
			return img;
		},
		
		onRemove: function(map) {
			// Nothing to do here
		}
	});

	L.control.watermark = function(opts) {
		return new L.Control.Watermark(opts);
	}
	
	L.control.watermark({ position: 'bottomleft' }).addTo(Map);
};


