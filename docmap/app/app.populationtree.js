const PopulationTree = function (Map, aerzte) {
	this.Map = Map;
	this.aerzte = aerzte;
	this.options = { height: 280, width: 240, style: { leftBarColor: COLOR1, rightBarColor: COLOR3 } }

}
PopulationTree.prototype.render = function (groups) {
	const selectedgroup = groups ? groups[0] : null;
	var aerzte = [];
	var data = [];
	const STEP = 5
	const Y = 1900 + new Date().getYear();
	for (var i = 0; i < 100; i += STEP) { data.push({ age: '' + i + '-' + (i + STEP), male: 0, female: 0 }); }
	aerzte = (selectedgroup)
		? this.aerzte.filter(function (a, i) {
			return a.arztgroups.indexOf(selectedgroup) > -1
		})
		: this.aerzte;
	aerzte.forEach(function (a) {
		const slot = Math.floor((Y - a.ctime) / STEP);
		if (a.gender == 'M')
			data[slot].male++
		else
			data[slot].female++
	});
	$('#pyramide').html('')
	pyramidBuilder(data.filter(function (s) {
		return (s.male > 1 || s.female > 1) ? true : false
	}), '#pyramide', this.options);

}
