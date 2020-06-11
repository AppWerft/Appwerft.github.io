const onLoad = function () {
    $("#tabs").tabs({
        active: 3
    });
    $('#tabs').fadeIn(600);
    const h = $(window).height() - $('.ui-tabs-nav').height() - 10 + 'px'
    $('#fragment-4').css("height", h);
    $('#fragment-4').height(h);
    var ipsum = new LoremIpsum();

    function requiredFieldValidator(value) {
        if (value == null || value == undefined || !value.length) {
            return { valid: false, msg: "This is a required field" };
        } else {
            return { valid: true, msg: null };
        }
    }

    var grid;
    var data = [];
    var columns = [
        { id: "title", name: "Titel", field: "title", width: 120, cssClass: "cell-title", editor: Slick.Editors.Text, validator: requiredFieldValidator, sortable: true },
        { id: "desc", name: "Beschreibung", field: "description", width: 200, editor: Slick.Editors.LongText },
        { id: "duration", name: "Laufzeit", field: "duration", width: 120, editor: Slick.Editors.Text, sortable: true },
        { id: "lanr", name: "LANR", field: "lanr", width: 120, editor: Slick.Editors.Text, sortable: true },
        { id: "henr", name: "HENR", field: "henr", width: 120, editor: Slick.Editors.Text, sortable: true },
        { id: "bsnr", name: "BSNR", field: "bsnr", width: 120, editor: Slick.Editors.Text, sortable: true },
        { id: "vknr", name: "VKNR", field: "vknr", width: 120, editor: Slick.Editors.Text, sortable: true },
        { id: "%", name: "% fertig", field: "percentComplete", width: 240, resizable: false, formatter: Slick.Formatters.PercentCompleteBar, editor: Slick.Editors.PercentComplete, sortable: true },
        { id: "start", name: "Start", field: "start", minWidth: 160, editor: Slick.Editors.Date },
        { id: "finish", name: "Finish", field: "finish", minWidth: 160, editor: Slick.Editors.Date },
        {
            id: "effort-driven", name: "Erledigt", width: 180, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven",
            field: "effortDriven", formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox
        }
    ];
    var options = {
        editable: true,
        enableCellNavigation : true,
        asyncEditorLoading: false,
        autoEdit: true,
        enableColumnReorder: true
    };

    $(function () {
        for (var i = 0; i < 50000; i++) {
            var d = (data[i] = {});
            d["vknr"] = Math.round(Math.random() * 100000000)
            d["bsnr"] = Math.round(Math.random() * 100000000)

            d["lanr"] = Math.round(Math.random() * 100000000)
            d["henr"] = Math.round(Math.random() * 100000000)

            d["title"] = "Task " + i;
            d["description"] = ipsum.sentence(2, 4);
            d["duration"] = Math.round(Math.random() * 100) + " days";
            d["percentComplete"] = Math.round(Math.random() * 100);
            d["start"] = "01/01/2009";
            d["finish"] = "01/05/2009";
            d["effortDriven"] = (i % 5 == 0);
        }

        grid = new Slick.Grid($("#fragment-4"), data, columns, options);

        grid.setSelectionModel(new Slick.CellSelectionModel());
        grid.onContextMenu.subscribe(function (e) {
            e.preventDefault();
            var cell = grid.getCellFromEvent(e);
            //grid.setSelectedRows(cell.row);
          
           $(e.target).addClass("ui-state-hover")
          });
        

    });
    grid.onSort.subscribe(function (e, args) { // args: sort information. 
        var field = args.sortCol.field;
		data.sort(function(a, b){
			var result = 
				a[field] > b[field] ? 1 :
				a[field] < b[field] ? -1 :
				0;
			return args.sortAsc ? result : -result;
		});
        slickgrid.invalidate();
    });
    $('.ui-tabs li:first').css('margin-left', '2px')

    $(".slick-row")
        .mouseover(function (e) {
            $(e.target).parent().addClass("ui-state-hover")
        })
        .mouseout(function (e) {
            $(e.target).parent().removeClass("ui-state-hover")
        });
    var newHeight = $("400px");

};

window.onload = onLoad;
