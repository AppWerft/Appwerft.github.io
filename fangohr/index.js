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
	}, 3000);
	const beteiligung = { istRad: 'Fahrrad', IstPKW: 'Personenkraftwagen', IstFuss: 'Fußgänger' ,IstKrad:'Kraftrad',IstGkfz:'Güterkraftwagen',IstSonstig: 'Sonstiges'};
	this.Object.keys(beteiligung).forEach(function (item) {
		$('#beteiligung').append('<li class="drawer-menu-item"><label class="switch"><input checked="1" type="checkbox" name="' + item + '"><span class="slider round"></span></label><legend>' + beteiligung[item] + '</legend></li>')
	}),
	$('#beteiligung input').on('change',function(){
		const self = $(this);	
		
		UnfallLayer.setFilter(self.attr('name'),self.is(':checked'))

		console.log(self);
	});

};