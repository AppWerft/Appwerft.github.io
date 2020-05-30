const Unfälle = function (heatmapLayer) {
    this.heatmapLayer = heatmapLayer;
    this.data = null;

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

Unfälle.prototype.getNearestUnfall = function (lat,lng) {
    return 'gefunden'

};
Unfälle.prototype.getTotal = function (field) {
    var res = {};
    console.log(field)
    this.data.forEach(function(d,i){
        !i && console.log(d[field])
        if (!res[d[field]]) res[d[field]]=1;
        else res[d[field]]++;
    })
    return res;
};    

Unfälle.prototype.setFilter = function (field, enabled) {
    console.log(field + '  ' + enabled);
    var filtereddata= [];
    console.log(this.data[0])
    if (enabled) {
        filtereddata = this.data.filter(function (d) {
            return d[field] == '1';
        })
    } else {
        filtereddata = this.data.filter(function (d) {
            return d[field] == '0';
        });
    }
    const heatdata = filtereddata.map(function (d) {
        return {
            count: d.UKATEGORIE * 50,
            lat: parseFloat(d.YGCSWGS84.replace(',', '.')),
            lng: parseFloat(d.XGCSWGS84.replace(',', '.'))
        };
    });
    this.heatmapLayer.setData({ data: heatdata });
}