window.onload = function () {
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
		crs: L.CRS.EPSG25832
	}).addTo(Map);

	$.get('./unfaelle.csv?1', function (_csv) {
		const csv = $.csv.toObjects(_csv, { separator: ';', }).filter(function () {
			return (arguments[0].ULAND == '2')
		})
		var data = csv.map(function (d) {
			return {
				count: 10,
				lat: parseFloat(d.YGCSWGS84.replace(',', '.')),
				lng: parseFloat(d.XGCSWGS84.replace(',', '.'))
			};
		});

		var heatmapLayer = new HeatmapOverlay({
			"radius": 5,
			"maxOpacity": 0.7,
			"scaleRadius": false,
			"useLocalExtrema": true,
			valueField: 'count',
			latField: 'lat',
			lngField: 'lng',
		});

		heatmapLayer.setData({ data: data });
		Map.addLayer(heatmapLayer);
	});
};