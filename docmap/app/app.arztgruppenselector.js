const ArztgruppenSelector = function (Map) {
    this.Map = Map;
    this.container = $('#arztgroups');
    this.allselected = true;
    return this;
}

ArztgruppenSelector.prototype.getSelected = function () {
    var gruppen = [];
    $('#selector .ag[active="1"]').each(function (g) { gruppen.push($(this).data('gruppe')) });
    return gruppen;
}

ArztgruppenSelector.prototype.create = function (gruppen) {
    gruppen.forEach(function (gruppe) {
        const enabled = gruppe.enabled ? '1' : '0';
        //  const pdf = '<a class="pdfgruppenrunterlader" href="pdf/'+gruppe.name.replace(/[\s]+/g,'_')+'.pdf"><img src="assets/pdf.png"></a>'; // TODO
        this.container.append('<div title="<i>Fachgruppenfilter</i><br>Nur diese Gruppe (' + gruppe.name + ')<br/>auf der Karte zeigen" data-gruppe="' + gruppe.name + '" active="' + enabled + '" class="ag">'
            + gruppe.name + ' <span>(' + gruppe.total + ')</span></div>');
    }.bind(this));
    $('.ag').on('click', function (e) {
        const clickedgroup = $(e.target);
        if (this.allselected == true) {
            $('.ag').attr('active', 0);
            clickedgroup.attr('active', 1);
            this.allselected = false;
        } else {
            if (clickedgroup.attr('active') == '1') {
                $('.ag').attr('active', 1);
                this.allselected = true;
            } else {
                $('.ag').attr('active', 0);
                clickedgroup.attr('active', 1);
            }
        }
        var gruppen = [];
        $('#selector .ag[active="1"]').each(function (g) { gruppen.push($(this).data('gruppe')) });
        this.Map.aerzteOverlay.render({ selected_groups: gruppen });
        $('#suchschlund').val('')
        this.Map.populationTree.render(gruppen);
        return;
    }.bind(this));

    $('[title!=""]').qtip({
        style: { classes: 'qtip-light' },
        position: {
            my: 'top left',  // Position my top left...
            at: 'bottom left',
        }
    });
    /*
   */
}