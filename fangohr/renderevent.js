const renderEvent = function (e) {
	var res = '<dl>';
	const url = 'https://www.mapquestapi.com/geocoding/v1/reverse?key=' + KEY + '&location=' + e.YGCSWGS84 + ',' + e.XGCSWGS84 + '&callback=reverseGeocodeResult';
	$.ajax({ url: url, dataType: "jsonp" });
	res += '<dt>Nächste Adresse:</dt>';
	res += ('<dd><!--ADDRESS--></dd>');
	res += '<dt>Unfallkategorie:</dt>';
	const KATS = ['Unfall mit Getöteten',
		'Unfall mit Schwerverletzten',
		'Unfall mit Leichtverletzten'];
	res += ('<dd>' + KATS[parseInt(e.UKATEGORIE) - 1] + '</dd>');
	res += '<dt>Unfalltyp:</dt>';
	const TYPES = ['Fahrunfall',
		'Abbiegeunfall',
		'Einbiegen / Kreuzen-Unfall',
		'Überschreiten-Unfall',
		'Unfall durch ruhenden Verkehr',
		'Unfall im Längsverkehr',
		'sonstiger Unfall'];
	res += ('<dd>' + TYPES[parseInt(e.UTYP1) - 1] + '</dd>');
	const ARTS = ['keine Angabe', 'Zusammenstoß mit anfahrendem/ anhaltendem/ruhendem Fahrzeug',
		'Zusammenstoß mit vorausfahrendem / wartendem Fahrzeug',
		'Zusammenstoß mit seitlich in gleicher Richtung fahrendem Fahrzeug',
		'Zusammenstoß mit entgegenkommendem Fahrzeug',
		'Zusammenstoß mit einbiegendem / kreuzendem Fahrzeug',
		'Zusammenstoß zwischen Fahrzeug und Fußgänger Aufprall auf Fahrbahnhindernis',
		'Abkommen von Fahrbahn nach rechts Abkommen von Fahrbahn nach links',
		'Unfall anderer Art']
	if (true) {
		res += '<dt>Unfallart:</dt>';
		res += ('<dd>' + ARTS[parseInt(e.UART)] + '</dd>');
	}
	const LICHT = 'Tageslicht Dämmerung Dunkelheit';
	res += '<dt>Lichtverhältnisse:</dt>';
	res += ('<dd>' + LICHT.split(' ')[parseInt(e.ULICHTVERH)] + '</dd>');
	res += '<dt>Beteiligte:</dt>';
	const B = {
		IstRad: 'Fahrradbeteiligung',
		IstPKW: 'PKW-Beteiligung',
		IstFuss: 'Fußgängerbeteiligung',
		IstKrad: 'Kraftradbeteiligung',
		IstGkfz: 'Güterkraftfahrzeug',
		IstSonstig: 'Unfall mit Sonstigen'
	};
	var beteiligungen = [];
	Object.keys(B).forEach(function (b) {
		if (e[b] == 1) beteiligungen.push(B[b]);
	})
	res += ('<dd>' + beteiligungen.join(', ') + '</dd>');


	const MONATE = 'Januar Februar März April Mai Juni Juli August September Oktober November Dezember';

	res += '<dt>Unfallzeitpunkt:</dt>';
	const WD = 'Montag Dienstag Mittwoch Donnerstag Freitag Samstag Sonntag';
	res += ('<dd>im ' + MONATE.split(' ')[parseInt(e.UMONAT) - 1] +' '+ e.UJAHR +' an einem ' + WD.split(' ')[parseInt(e.UWOCHENTAG) - 1] + ' in der ' + e.USTUNDE + '. Stunde</dd>');

	res += '</dl>';
	popup = res;
	return res;
}