
const D = {
	suchschlund: $('#suchschlund'),
	selector: $('#selector'),
	searchbox: $('#searchbox'),
	searchselector: $('#searchselector'),
	drawer: $('.drawer')

};

function handleArztInfo() {
	Log('handleArztInfo start')
	$('.accordiontrigger').not('.accordiontrigger_active').next('.arztinfo').hide();
	$('.accordiontrigger').click(function () {
		Log('triggered')
		var trig = $(this);
		if (trig.hasClass('accordiontrigger_active')) {
			trig.next('.arztinfo').slideToggle('slow');
			trig.removeClass('accordiontrigger_active');
		} else {
			$('.arztinfo').next('.arztinfo').slideToggle('slow');
			$('.accordiontrigger_active').removeClass('accordiontrigger_active');
			trig.next('.arztinfo').slideToggle('slow');
			trig.addClass('accordiontrigger_active');
		};
		return false;
	});
	setTimeout(QRcode, 200); // delayed for quicker popup anwser
	setTimeout(Scheduler, 300); // delayed for quicker popup anwser
}
const AerzteOverlay = function (Map) {
	this.Map = Map;
	this.arztLayer = L.featureGroup();
	Log('Constructor Ärzteoverlay')
	this.arztLayer.on('popupopen', function (e) {
		Log('popopen::::::::::::::::::::::::::event')
		const loc = e.popup.options.loc;
		const html = '<img width="150" src="./assets/kvh-logo.svg"><br/><br/><i>Ärzte/Psychotherapeuten:</i><div class="arztcontainer">###AERZTE###</div><br><i>Adresse:</i><br>' + loc.street + "<br>" + loc.zip + ' ' + loc.city;
		var aerzte = [];
		e.popup.options.bsnrs.forEach(function (bsnr) {
			this.aerzte.forEach(function (arzt) {
				const bsnrs = Object.keys(arzt.bsnrs).map(toInt);
				if (bsnrs.indexOf(bsnr) > -1 && aerzte.indexOf(arzt.name) == -1) {
					aerzte.push({ a: arzt, b: bsnr })
				}

			});
		}.bind(this));
		// sort by family name		
		aerzte = aerzte.sort(function (a, b) { return a.a.nachname > b.a.nachname });
		// apply filter:
		const selectedgroups = this.Map.arztgruppenSelector.getSelected();
		aerzte = aerzte.filter(function (arzt) {
			const arztgroups = arzt.a.arztgroups;
			const found = arztgroups.filter(function (ag) {
				return selectedgroups.indexOf(ag) > -1
			});
			return found.length > 0
		});
		Log("Ärzte: " + aerzte.length)
		// rendern und joinen
		var content = '';
		aerzte.forEach(function (arzt) {
			content += new ArztInfo(arzt, loc, this.locations).getHtml();
		}.bind(this));

		e.popup.setContent(html.replace('###AERZTE###', content));
		Log('ArztInfos rendered')
		handleArztInfo(); // accordion
		Log('handleArztInfo finished')
	}.bind(this));

	this.arztLayer.on('tooltipopen', function (e) {
		var content = e.tooltip.getContent();
		var aerzte = [];
		e.tooltip.options.bsnrs.forEach(function (bsnr) {
			this.aerzte.forEach(function (arzt, i) {
				var bsnrs = Object.keys(arzt.bsnrs).map(toInt);
				if (bsnrs.indexOf(bsnr) > -1) aerzte.push(arzt.name);
			});
		}.bind(this));

		e.tooltip.setContent(content.replace('###AERZTE###', '<br/><i>Betriebsstätten: ' + e.tooltip.options.bsnrs.length + '<br>LeistungserbringerInnen: ' + aerzte.length + '</i>'));
	}.bind(this))
}

AerzteOverlay.prototype.setLocations = function (locations) {
	this.locations = locations;

}
AerzteOverlay.prototype.setAerzte = function (aerzte) {
	this.aerzte = aerzte;
}
AerzteOverlay.prototype.render = function (filter, autocenter) {
	Log('render Ärzteoverlay')
	function toInt(b) { return parseInt(b) }

	if (!filter) filter = {}; // protect exception!
	if (!autocenter) autocenter = true;
	if (this.Map.hasLayer(this.arztLayer)) {
		this.Map.removeLayer(this.arztLayer);
		this.arztLayer.clearLayers();
	}
	var points = [];
	this.locations.forEach(function (loc) {
		if (!!filter.selected_groups) {
			var filtered = loc.arztgroups.filter(function (gr) {
				return filter.selected_groups.indexOf(gr) > -1
			});
			//if (loc.gruppen.indexOf(gruppe)==-1) return;
			if (filtered.length == 0) return;
		}
		if (!!filter.selected_bsnrs) {
			filter.selected_bsnrs = filter.selected_bsnrs.map(toInt)
			var filtered = loc.bsnrs.filter(function (bsnr) {
				return filter.selected_bsnrs.indexOf(bsnr) > -1;
			});
			if (filtered.length == 0) return;
		}
		if (!!filter.selected_street) {
			if (loc.street.indexOf(filter.selected_street.value) < 0) return;

		}
		if (!!filter.selected_streets) {
			const strasse = loc.street.stripStreet();
			if (filter.selected_streets.indexOf(strasse) < 0) return;
		}
		const radius = Math.sqrt(Math.sqrt(loc.bsnrs.length));
		const opts = {
			radius: 7 * radius,
			weight: 1,
			color: ' #0764a9'
		};
		const ttopts = {
			direction: 'auto',
			sticky: true,
			bsnrs: loc.bsnrs
		};
		const marker = L.circleMarker(loc.latlng, opts);
		marker.bindTooltip(loc.street + '###AERZTE###', ttopts);
		marker.bindPopup('<div></div>', { bsnrs: loc.bsnrs, loc: loc });
		marker.addTo(this.arztLayer);
		points.push(L.latLng(loc.latlng)); // helper for fitting map to bounds
	}.bind(this));
	this.arztLayer.addTo(this.Map);

	

	

	if (Object.keys(filter).length > 0 && points.length > 0) {
		//Map.fitBounds( L.latLngBounds(points));
	}
}// JavaScript source code
