const QRcode = function () {
    $('.qrvcard').each(function () {
        Log('Start QRCode')
        var arzt = JSON.parse($(this).attr('data-arzt').b64_to_utf8());
        var location = JSON.parse($(this).attr('data-location').b64_to_utf8());
        var vcard = [];
        vcard.push('BEGIN:VCARD');
        vcard.push('VERSION:4');
        arzt.titel && vcard.push('N;CHARSET=UTF-8:' + arzt.nachname + ';' + arzt.vorname + ';;' + arzt.titel);
        arzt.titel && vcard.push('FN;CHARSET=UTF-8:' + arzt.titel + ' ' + arzt.vorname + ' ' + arzt.nachname);
        arzt.bezeichnung && vcard.push('TITLE;;CHARSET=UTF-8;TYPE=work:' + arzt.bezeichnung);
        arzt.telefon && vcard.push('TEL;TYPE=work,voice;VALUE=uri:tel:  ' + arzt.telefon.cleanTel());
        arzt.mobile && vcard.push('TEL;TYPE=mobile,voice;VALUE=uri:tel: ' + arzt.mobile.cleanTel());
        arzt.mail && vcard.push('EMAIL;TYPE=work:' + arzt.mail);
        vcard.push('PHOTO;MEDIATYPE=image/png:https://www.kvhh.net/media/public/sites/kvhh/css/img/kvhh_logo.png')
        location && vcard.push('ADR;CHARSET=UTF-8;TYPE=work:;;' + location.street + ';;' + location.zip + ' ' + location.city + ';Germany');
        location && vcard.push('GEO;TYPE=work:geo: ' + location.latlng[0] + '\\,' + location.latlng[1]);
        vcard.push('END:VCARD');
        const text = vcard.join('\n');
        var qrcode = new QRious({
            element: this,
            size: 250,
            padding: 0,
            level: 'L',
            foreground: 'steelblue',
            value: vcard.join('\n'),
        });
    });
};