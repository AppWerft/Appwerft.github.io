function handleArztInfo() {
    $('.qrvcard').each(function () {
        var arzt = JSON.parse($(this).attr('data-arzt').b64_to_utf8());
        var location = JSON.parse($(this).attr('data-location').b64_to_utf8());
        var vcard = [];
        vcard.push('BEGIN:VCARD');
        vcard.push('VERSION:4');
        arzt.titel && vcard.push('N:' + arzt.nachname + ';' + arzt.vorname + ';;' + arzt.titel);
        arzt.titel && vcard.push('FN:' + arzt.titel + ' ' + arzt.vorname + ' ' + arzt.nachname);
        arzt.bezeichnung && vcard.push('TITLE;TYPE=work:' + arzt.bezeichnung);
        arzt.telefon && vcard.push('TEL;TYPE=work,voice;VALUE=uri:tel:  ' + arzt.telefon.cleanTel());
        arzt.mobile && vcard.push('TEL;TYPE=mobile,voice;VALUE=uri:tel: ' + arzt.mobile.cleanTel());
        arzt.mail && vcard.push('EMAIL;TYPE=work:' + arzt.mail);
        vcard.push('PHOTO;MEDIATYPE=image/png:https://www.kvhh.net/media/public/sites/kvhh/css/img/kvhh_logo.png')
        location && vcard.push('ADR;TYPE=work:;;' + location.street + ';;' + location.zip + ' ' + location.city + ';Germany');
        location && vcard.push('GEO;TYPE=work:geo: ' + location.latlng[0] + '\\,' + location.latlng[1]);
        vcard.push('END:VCARD');
        const text = vcard.join('\n');
        //	console.log(text)
        var qrcode = new QRious({
            element: this,
            size: 250,
            padding: 0,
            level: 'L',
            foreground: '#444',
            value: vcard.join('\n'),
        });
    });
    $('.accordiontrigger').not('.accordiontrigger_active').next('.arztinfo').hide();
    
    // handling of accordion:
    $('.accordiontrigger').click(function () {
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

}
function toInt(b) { return parseInt(b) }


const ArztInfo = function (arztObj, location, locations) {
    //console.log(arztObj);
    var arzt = arztObj.a;
    var bsnr = arztObj.b;
    this.html = '';
    function getLocationsByBsnrs(bsnr) { return locations.filter(function (loc) { return loc.bsnrs.indexOf(bsnr) > -1 }); }
    function isAuf(von, bis) { 
        const jetzt = 60 * NOW.getHours() + NOW.getMinutes(); 
        return (jetzt > von && jetzt < bis) ? true : false; 
    }
    arzt.name = [arzt.titel, arzt.vorname, arzt.nachname].join(' ');
    const A = arzt.gender == "M" ? 'Arzt' : 'Ärztin';
    var arzttext = A + " ";
    const NOW = new Date();
    const wd = (NOW.getDay()+6)%7; // getDay begins at sunday!
    const mm = 60 * NOW.getHours() + NOW.getMinutes();
    const schema = arzt.bsnrs[bsnr];
    if (!schema) {
        this.html = '<div class="accordiontrigger" title="Es liegen keine Details zu den Öffnungszeiten vor">' + arzt.name + '</div>\n';
        arzttext += "hat keine Informationen zu den Öffnungszeiten hinterlegt."
    }
    else {  // there are opening data:
        const S = schema[wd];
        if (!S) {
            arzttext += "hat heute geschlossen";
            this.html += '<div title="' + A + ' hat heute geschlossen" class="accordiontrigger closed"><img class="zu" src="./assets/zurot.png" />' + arzt.name + '</div>\n';
        } else {
            if ( S.filter(function(timegap){
                return isAuf(timegap[0],timegap[1]);
            }).length>0) {
                this.html += '<div class="accordiontrigger opened"><img class="auf" src="./assets/aufgruen.png" />' + arzt.name + '</div>\n';
                arzttext += "hat derweil geöffnet";
            } else {
                this.html += '<div title="' + A + ' hat heute generell Sprechstunde, derweil nicht" class="accordiontrigger closed"><img class="zu" src="./assets/zurot.png" />' + arzt.name + '</div>\n';
                arzttext += "hat heute Sprechzeiten, hat allerdings jetzt nicht geöffnet";
            }
        }
    }

    var telefon, mobile, mail, vcard;
    if (arzt.telefon) {
        const number = arzt.telefon.cleanTel();
        telefon = '\t<p class="numbers">☎  ' + number + '</p>\n';
    } else telefon = '';
    if (arzt.mobile) {
        const mnumber = arzt.mobile.cleanTel();
        mobile = '\t<p class="numbers">📱' + mnumber + '</p>\n';
    } else mobile = '';
    if (arzt.mail) {
        mail = '\t<p class="numbers">✉ <a title="Öffnet Mailprogramm mit ' + arzt.mail + '" href="mailto:' + arzt.mail + '">' + arzt.mail + '</a></p>\n';
    } else mail = '';
    var praxen = ''
    vcard = '\t<br/><i>Visitenkarte für das Smartphone-Adressbuch:</i><br/>\n\t<canvas class="qrvcard" data-arzt="' + JSON.stringify(arzt).utf8_to_b64() + '" '
        + ' data-location="' + JSON.stringify(location).utf8_to_b64() + '"></canvas>';
    const otherlocations = Object.keys(arzt.bsnrs).map(toInt).filter(function (b) { return (b != bsnr) }).map(getLocationsByBsnrs);
    if (otherlocations.length > 0) {
        praxen = '\n\t<p><i>weitere Praxenstandorte:</i><br/>';
        otherlocations.forEach(function (loc) {
            loc[0] && (praxen += (loc[0].address + '<br>'))
        })
        praxen += '</p>\n'
    }

    this.html += '<div class="arztinfo">\n\t<h3>'
        + arzt.bezeichnung + '</h3>\n'
        + '\t<div class="arzttext">' + arzttext + '</div>\n';
    if (schema) {
        this.html += ('\t<svg data-schema="' + JSON.stringify(schema).utf8_to_b64() + '" ></svg>\n');
        console.log("SVG embeded")
    } 
    this.html += (telefon + mobile + mail + vcard + praxen+ '</div>\n\n'); 
    return this;
}

ArztInfo.prototype.getHtml = function () {
    return this.html;
}