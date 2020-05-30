window.onload = function () {
	$('.drawer').drawer();
	const Map = new L.Map('unfallkarte', {
		center: new L.LatLng(53.535, 10.09),
		zoom: 11,
		layers: [L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}@2x.png', {
			attribution: ''
		})]
	});

	$.get('./unfaelle.csv?1', function (_csv) {
		const csv = $.csv.toObjects(_csv, { separator: ';', }).filter(function(){
			return (arguments[0].ULAND=='2')
		})
		console.log(csv)
		var data	= csv.map(function (d) {
				return {
				count:10,
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
		
		heatmapLayer.setData({ data: data});
		Map.addLayer(heatmapLayer);
	});
};