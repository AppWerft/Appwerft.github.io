const Autocompleter = function (Map, type) {
	if (!type) type = 'ARZT';
	this.Map = Map;

	$('#suchschlund').focusin(function () {
		console.log('suchschlund cought focus')
		$(this).val('');
	});
	this.aerzte = [];
	this.adressen = [];
	this.HANDLER = {
		ARZT: {
			onSearchComplete: function (query, suggestions) {
				D.selector.hide();
				var bsnrs = [];
				suggestions.forEach(function (sug) {
					Object.keys(sug.data.bsnrs).forEach(function (bsnr) { bsnrs.push(bsnr); })
				});
				if (query.length > 3)
					this.Map.aerzteOverlay.render({ selected_bsnrs: bsnrs });
			}.bind(this),
			lookup: function (query, done) {
				filteredAerzte = this.aerzte.filter(function (lanr) {
					return lanr.nachname.toUpperCase().indexOf(query.toUpperCase()) != -1;
				})
				done({
					"query": query,
					"suggestions": filteredAerzte.map(function (a) {
						return {
							value: [a.titel, a.vorname, a.nachname].join(' '),
							data: a
						};
					})
				});
			}.bind(this),
			onSelect: function (suggestion) {
				var bsnrs = [];
				Object.keys(suggestion.data.bsnrs).forEach(function (bsnr) { bsnrs.push(bsnr); })
				D.selector.show();
				this.Map.aerzteOverlay.render({ selected_bsnrs: bsnrs });
			}.bind(this),
		},
		STRASSE: {
			lookup: function (query, done) {
				var filteredStreets = [];
				this.strassen.forEach(function (loc) {
					const street = loc.street.stripStreet();
					if (street.toLowerCase().indexOf(query.toLowerCase()) != -1 && filteredStreets.indexOf(street) < 0) filteredStreets.push(street);
				});
				done({
					"query": query,
					"suggestions": filteredStreets.map(function (street) { return { value: street } })
				});
			}.bind(this),
			onSearchComplete: function (query, suggestions) {
				D.selector.hide();
				if (query.length > 3)
					this.Map.aerzteOverlay.render({ selected_streets: suggestions.map(function (s) { return s.value; }) });
			}.bind(this),
			onSelect: function (suggestion) {
				D.selector.show();
				this.Map.aerzteOverlay.render({ selected_street: suggestion });
			}.bind(this)

		},
	};

	$('#suchschlund').autocomplete({
		minChars: 2,
		lookupLimit: 42,
		maxHeight: '50%',
		onHide: function () {
			D.selector.show();
			//renderBetriebsstaetten(); 
		}
	});
	$('#suchschlund').autocomplete('setOptions', this.HANDLER[type]);
	return this;
}
Autocompleter.prototype.reset = function () {
	$('#suchschlund').val('');

};
Autocompleter.prototype.setTypeTo = function (type) {
	$('#suchschlund').autocomplete('setOptions', this.HANDLER[type]);

};

Autocompleter.prototype.setAerzte = function (aerzte) {
	this.aerzte = aerzte;
};
Autocompleter.prototype.setStrassen = function (strassen) {
	this.strassen = strassen;
};
