const COLOR1 = "#0764a9", COLOR2 = "#99bbff", COLOR3 = "#bb0000";

const MOBILE = (navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i)) ? true : false;
String.prototype.stripStreet = function () {
	return this.replace(/[\d]+/g, '').replace(/ ([a-z\-\/]{1})$/g, '').trim().replace(/ ([a-z\-\/]{1})$/g, '').trim();
}

String.prototype.utf8_to_b64 = function () {
	return window.btoa(unescape(encodeURIComponent(this)));
}

String.prototype.b64_to_utf8 = function () {
	return decodeURIComponent(escape(window.atob(this)));
}




String.prototype.cleanTel = function (vw) {
	return this.replace(/[\s\/]+/g, '').replace(/^0/, vw || '+49 ')
}

Number.prototype.minsToHHMM = function () {
	var mins_num = parseFloat(this, 10); // don't forget the second param
	var hours = Math.floor(mins_num / 60);
	var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
	var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));

	// Appends 0 when unit is less than 10
	if (hours < 10) { hours = "0" + hours; }
	if (minutes < 10) { minutes = "0" + minutes; }
	if (seconds < 10) { seconds = "0" + seconds; }
	return hours + ':' + minutes;
};


String.prototype.stripStreet = function () {
	return this.replace(/[\d]+/g, '').replace(/ ([a-z\-\/]{1})$/g, '').trim().replace(/ ([a-z\-\/]{1})$/g, '').trim();
}


Number.prototype.minsToHHMM = function () {
	var mins_num = parseFloat(this, 10); // don't forget the second param
	var hours = Math.floor(mins_num / 60);
	var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
	var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));

	// Appends 0 when unit is less than 10
	if (hours < 10) { hours = "0" + hours; }
	if (minutes < 10) { minutes = "0" + minutes; }
	if (seconds < 10) { seconds = "0" + seconds; }
	return hours + ':' + minutes;
}