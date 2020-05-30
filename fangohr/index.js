var start = new Date().getTime();

function Log(text) {
	var now = new Date().getTime();
	console.log((now-start)+ ' '+text);
	start=now;
}

Log(start);
window.onload = function () {
	this.Log('onload');
	$('.drawer').drawer();
	const Map = new L.Map('unfallkarte', {
		center: new L.LatLng(53.5562788,9.985348),
		zoom: 14,
		layers: []
	});
	L.tileLayer.wms(
		'https://geodienste.hamburg.de/HH_WMS_DOP?', {
		service: 'WMS',
		version :'1.3.',
		request: 'GetMap',
		format: 'image/jpeg',
		transparent: 'true',
		layers: 1,
		width: 512,
		height: 512,
		opacity:0.9,
		crs: L.CRS.EPSG25832
	}).addTo(Map);
	
	var heatmapLayer = new HeatmapOverlay({
		"radius": 8,
		max : 10,
		"maxOpacity": 1,
		"scaleRadius": false,
		"useLocalExtrema": true,
		valueField: 'count',
		latField: 'lat',
		lngField: 'lng',
	});
	Map.addLayer(heatmapLayer);

	Log('addL')
	$.get('./unfaelle.csv?1', function (_csv) {
		Log('csv loaded ...')
		const csv = $.csv.toObjects(_csv, { separator: ';', }).filter(function () {
			return (arguments[0].ULAND == '2')
		})
		Log('toObject ...')
		var data = csv.map(function (d) {
			return {
				count: d.UKATEGORIE*50,
				lat: parseFloat(d.YGCSWGS84.replace(',', '.')),
				lng: parseFloat(d.XGCSWGS84.replace(',', '.'))
			};
		});
		Log('mapping')

		
	    // Filter depending of drawer
		heatmapLayer.setData({ data: data });
		Log('csv set')
		
	});
};