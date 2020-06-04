
	const MiniMap = function (Map) {
		var last = {
			center: Map._lastCenter,
			zoom :Map._layersMinZoom
		}	
		function onEachFeature(feature, layer) {
			var  BIGLAYERS;
			this.selectedId;
			const DEFAULT = {weight:.5,opacity:0.4,fillOpacity:0.1,fillColor:'black'}
			const PASSIV =  {weight:.5,opacity:0.4,fillOpacity:0.4,fillColor:'steelblue'}
			const ACTIVE =  {weight:2.5,opacity:0.4,fillOpacity:0}
			
			const name = "<i>" + feature.properties.bezirk + "</i><br>" + feature.properties.stadtteil;
			layer.bindTooltip(name, { direction: 'auto', sticky: true });
			layer.on('mouseover', function () {
				if (!BIGLAYERS) BIGLAYERS = Map.stadtteileLayer._layers;
				const objectid = this.feature.properties.objectid;
				const layerid = Object.keys(BIGLAYERS).filter(function(layerid){
					return (BIGLAYERS[layerid].feature.properties.objectid==objectid);
				})[0];
			//	layers[layerid].options.weight=layers[layerid].options.weight*2;
			//	BIGLAYERS[layerid].setStyle(ACTIVE)
				this.setStyle({
					fillColor: COLOR1
				});
			});
			layer.on('mouseout', function () {
				
				Object.keys(BIGLAYERS).forEach(function(layerid){
				//	BIGLAYERS[layerid].setStyle(DEFAULT);
				});
				if (!feature.properties.selected)
					this.setStyle({
						fillColor: COLOR2
					});
			});
			layer.on('click', function () {
				const props =  feature.properties;
				const clickedId = props.objectid;
				console.log('clickedId='+clickedId + '  selectedId='+this.selectedId)
				if (props.selected ==true && clickedId==this.selectedId) {
					props.selected=false;
					
				} else {
					props.selected=true;
					this.selectedId=props.objectid;
				}	

				// clean all:
				Object.keys(BIGLAYERS).forEach(function(layerid){
					BIGLAYERS[layerid].setStyle(PASSIV);
				});
				Object.keys(miniMap.stadtteileLayer._layers).forEach(function(id){const layer = miniMap.stadtteileLayer._layers[id];
					layer.setStyle({fillColor:COLOR2});
				});
				
				
				const layerid = Object.keys(BIGLAYERS).filter(function(layerid){
					return (BIGLAYERS[layerid].feature.properties.objectid==clickedId);
				})[0];
				if (props.selected) {
					BIGLAYERS[layerid].setStyle(ACTIVE);
					layer.setStyle({
						fillColor: COLOR1
					});
					var points = [];
					feature.geometry.coordinates[0].forEach(function(pp){ 
							pp.forEach(function(p){points.push(L.latLng(p[1], p[0])) });})
					if (points.length)
						Map.flyToBounds(L.latLngBounds(points), { padding: [10, 10] });
				} else {
					Object.keys(BIGLAYERS).forEach(function(layerid){
						BIGLAYERS[layerid].setStyle(DEFAULT);
					});
					console.log(last.center)
					Map.flyTo(last.center,last.zoom+1);
				}
		
				
			});
		};
		const miniMap = new L.Map('mapselector', { attributionControl: false, zoomControl: false, center: new L.LatLng(53.55, 10.06), dragging: false, minZoom: 9, maxZoom: 9, zoom: 9 });
		//const microMap = new L.Map('mapselectorpreview', { attributionControl: false, zoomControl: false, center: new L.LatLng(53.58, 10.02), dragging: false, minZoom: 7, maxZoom: 7, zoom: 7 });
	    $.getJSON("./app/data/model_stadtteile.geojson?__",function(data){
			miniMap.stadtteileLayer = L.geoJson(data, {
				onEachFeature: onEachFeature,
				weight: .8,
				fillColor: COLOR2,//'#0764a9',
				color: COLOR1,
				fillOpacity: .8
	
			});
			miniMap.stadtteileLayer.addTo(miniMap);
		});
		
	//	stadtteileLayer.addTo(microMap);
		
	} // JavaScript source code
