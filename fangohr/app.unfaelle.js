const Unfälle = function (heatmapLayer) {
    this.heatmapLayer = heatmapLayer;
    this.data = null;
    this.filtereddata = [];
    this.filter = {
        IstRad: true,
        IstPKW: false,
        IstFuss: false,
        IstKrad: false,
        IstGkfz: false,
        IstSonstig: false
    }
    $.get('./unfaelle.csv?1', function (_csv) {
        Log('csv loaded ...')
        this.data = $.csv.toObjects(_csv, { separator: ';', }).filter(function () {
            return (arguments[0].ULAND == '2')
        })
        Log('csv loaded ...')
        const heatdata = this.data.map(function (d) {
            return {
                count: d.UKATEGORIE * 50,
                lat: parseFloat(d.YGCSWGS84.replace(',', '.')),
                lng: parseFloat(d.XGCSWGS84.replace(',', '.'))
            };
        });
        this.heatmapLayer.setData({ data: heatdata });
        Log('csv set')

    }.bind(this));
    return this;
};
Unfälle.prototype.getFilter = function () {
    return this.filter;
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
    console.log(field)
    this.data.forEach(function (d, i) {
        !i && console.log(d[field])
        if (!res[d[field]]) res[d[field]] = 1;
        else res[d[field]]++;
    })
    return res;
};

Unfälle.prototype.setFilter = function (field, enabled) {
    this.filter[field] = enabled ? true : false;
    this.filtereddata = [];
    console.log(this.data[0])
    this.data.forEach(function (unfall, ndx) {
        var found = false;
        Object.keys(this.filter).forEach(function (field) {
            if (this.filter[field] == true) {
                if (ndx == 0) {
                    console.log(unfall[field] + '   ' + field)
                }
                if (unfall[field] == 1) found = true;
            }
        }.bind(this));
        if (found) this.filtereddata.push(unfall);
    }.bind(this))
    console.log(this.filtereddata.length);
    const heatdata = this.filtereddata.map(function (d) {
        return {
            count: d.UKATEGORIE * 5,
            lat: parseFloat(d.YGCSWGS84.replace(',', '.')),
            lng: parseFloat(d.XGCSWGS84.replace(',', '.'))
        };
    });
    this.heatmapLayer.setData({ data: heatdata });
}