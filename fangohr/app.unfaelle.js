const Unfälle = function (heatmapLayer) {
    this.heatmapLayer = heatmapLayer;
    this.data = null;
    this.filtereddata = [];

    this.filter = {
        ist: {
            IstRad: true,
            IstPKW: false,
            IstFuss: false,
            IstKrad: false,
            IstGkfz: false,
         IstSonstig: false
        },
        kategorie : 2
    };
    $.get('./unfaelle.csv?1', function (_csv) {
        Log('csv loaded ...')
        this.data = $.csv.toObjects(_csv, { separator: ';', }).filter(function () {
            return (arguments[0].ULAND == '2')
        })
        Log('csv loaded ...')
        this.updateView();
    }.bind(this));
    return this;
};
Unfälle.prototype.getFilter = function () {
    return this.filter.ist;
}
Unfälle.prototype.getNearestUnfall = function (lat, lng) {
    console.log(lat + ' ' + lng)
    const myPoint = L.latLng(lat, lng);
    console.log(myPoint)
    this.filtereddata.forEach(function (d) {
        d.dist = L.latLng(d.YGCSWGS84, d.XGCSWGS84).distanceTo(myPoint)
    });
    this.filtereddata.sort(function (a, b) {
        return a.dist - b.dist;
    })
    var event = this.filtereddata[0]
    return event;
};
Unfälle.prototype.getTotal = function (field) {
    var res = {};

    this.data.forEach(function (d, i) {
        !i && console.log(d[field])
        if (!res[d[field]]) res[d[field]] = 1;
        else res[d[field]]++;
    })
    return res;
};

Unfälle.prototype.setIst = function (field, enabled) {
    if (field)
        this.filter.ist[field] = enabled ? true : false;
    
    Unfälle.updateView()
}
Unfälle.prototype.updateView = function () {
    var myfilters = [];
    Object.keys(this.filter.ist).forEach(function (field) {
        if (this.filter.ist[field] == true) myfilters.push(field);
    }.bind(this));
    console.log(myfilters);
    this.filtereddata = [];
    console.log(this.data[0])
    console.log(this.filter.ist)
    this.data.forEach(function (unfall, ndx) {
        var found = true;
        myfilters.forEach(function (field) {
            if (this.filter.ist[field] == true) {
                if (ndx == 0) {
                    console.log(unfall[field] + '   ' + field)
                }
                if (unfall[field] != 1) found = false;
            }
        }.bind(this));
        if (found && myfilters.length > 0) this.filtereddata.push(unfall);
    }.bind(this))
    const heatdata = this.filtereddata.map(function (d) {
        return {
            count: d.UKATEGORIE * 5,
            lat: parseFloat(d.YGCSWGS84.replace(',', '.')),
            lng: parseFloat(d.XGCSWGS84.replace(',', '.'))
        };
    });
    this.heatmapLayer.setData({ data: heatdata });
}