"use strict"

var start = new Date().getTime();
function Log(text) {
	const now = new Date().getTime();
	console.log((now - start) + ' ' + text);
	start = now;
}
function onReady() {
	const D = {
		suchschlund: $('#suchschlund'),
		selector: $('#selector'),
		searchbox: $('#searchbox'),
		searchselector: $('#searchselector'),
		drawer: $('.drawer')
	};

	const Map = new L.Map('uc9', {
		center: new L.LatLng(53.56, 10.02),
		zoom: 11,
		attributionControl: true, zoomControl: false
	});

	/* Some DOM manipulations*/
	[{ title: "Erreichbarkeitszeiten Psychotherapie", url: 'Erreichbarkeitszeiten_psychotherapie.pdf' }, {
		title: "Offene Sprechstunden", url: 'Offene_Sprechstunden.pdf'
	}
	].forEach(function (pdf) {
		$('#pdfrunterlader').append('<a href="https://dienste.ekvhh.de/' + pdf.url + '?' + new Date().getTime() + '"><img src="./assets/pdf.png" title="' + pdf.title + '"/></a>');
	});



	if (!MOBILE) {
		D.drawer.drawer(); // init

		D.searchbox.append('<div><input class="autocomplete" type="text" id="suchschlund" autocomplete="off" placeholder=" Suche nach ..." /><select id="searchtypeselector">'
			+ '<option value="ARZT" data-image="assets/arzticon.png?2"><span style="font-size:30px">👨‍⚕️</span> Arzt</option><option value="STRASSE" data-image="assets/roadicon.png?2">🏘️ Adresse</option></select></div>')
		//$('#searchtypeselector').msDropDown();
		$('#searchtypeselector').on('change', function () {
			D.selector.show();
			Map.suchSchlund.reset();
			Map.suchSchlund.setTypeTo($(this).val());
			console.log('setType')
			Map.aerzteOverlay.render();
		});

	}
	const DARKMAP = 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_SG?',
		LIGHTMAP = 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB?';
	Map.addLayer(L.tileLayer.wms(LIGHTMAP, {
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

	}));

	Map.aerzteOverlay = new AerzteOverlay(Map);
	Map.arztgruppenSelector = new ArztgruppenSelector(Map);
	Map.suchSchlund = new Autocompleter(Map);

	L.Control.Watermark = L.Control.extend({
		onAdd: function (map) {
			var img = L.DomUtil.create('img');
			img.src = './assets/kvh_gesundheit-logo.svg';
			img.style.width = '60%';
			img.style.opacity = 0.9;

			return img;
		},
		onRemove: function (map) {
		}
	});
	L.control.watermark = function (opts) {
		return new L.Control.Watermark(opts);
	}
	L.control.watermark({ position: 'bottomleft' }).addTo(Map);
	/* Adding city boundaries */

	if (!MOBILE) {
		$.getJSON("./app/data/model_stadtteile.geojson?___", function (data) {
			Map.stadtteileLayer = L.geoJson(data, {
				weight: 1.5,
				opacity: 0.4,
				color: COLOR3,
				fillColor: 'black',
				fillOpacity: 0.1
			});
			Map.stadtteileLayer.addTo(Map);
		});

	}
	/*  
		 
		
	/* fachliche Logik: */
	const DAY = Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24);
	$.getJSON('./app/data/model_groups.json?' + DAY, onArztGruppenLoad);
	$.getJSON('./app/data/model_aerzte.json?_' + DAY, onAerzteLoad);
	setTimeout(function () {
		$.getJSON('./app/data/model_locations.json?' + DAY, onLocationsLoad);
	}, 500);
	if (MOBILE) alert("Diese Anwendung ist nicht für mobile Geräte optimiert. Alternativ könne Sie die Apps aus den Stores auf Ihrem mobilen Gerät installieren.");
	else $('.drawer').drawer('open');
	MiniMap(Map);
	/*  END   */

	function onAerzteLoad(aerzte) {
		Map.suchSchlund && Map.suchSchlund.setAerzte(aerzte);
		Map.aerzteOverlay.setAerzte(aerzte);
		Map.populationTree = new PopulationTree(Map, aerzte);
		Map.populationTree.render(null)
	}

	function onLocationsLoad(locations) {
		Map.suchSchlund && Map.suchSchlund.setStrassen(locations);
		Map.aerzteOverlay.setLocations(locations);
		Map.aerzteOverlay.render();
	}

	function onArztGruppenLoad(aglist) {
		var gruppen = [];
		for (var ag in aglist) {
			gruppen.push({
				name: ag,
				total: aglist[ag],
				enabled: true
			});
		}
		Map.arztgruppenSelector.create(gruppen);
	}

};
$(document).ready(onReady);