
const onLoad = function () {
    $("#tabs").tabs({
        active: 3
    });

    function setupColumnReorder(grid, $headers, headerColumnWidthDiff, setColumns, setupColumnResize, columns, getColumnIndex, uid, trigger) {
        $headers.filter(":ui-sortable").sortable("destroy");
        $headers.sortable({
            //cancel: '#' + uid + 'title',
            containment: "parent",
            distance: 3,
            axis: "x",
            cursor: "default",
            tolerance: "intersection",
            helper: "clone",
            placeholder: "slick-sortable-placeholder ui-state-default slick-header-column",
            start: function (e, ui) {
                ui.placeholder.width(ui.helper.outerWidth() - headerColumnWidthDiff);
                $(ui.helper).addClass("slick-header-column-active");
            },
            beforeStop: function (e, ui) {
                $(ui.helper).removeClass("slick-header-column-active");
            },
            stop: function (e) {
                if (!grid.getEditorLock().commitCurrentEdit()) {
                    $(this).sortable("cancel");
                    return;
                }

                var reorderedIds = $headers.sortable("toArray");
                var reorderedColumns = [];
                for (var i = 0; i < reorderedIds.length; i++) {
                    reorderedColumns.push(columns[getColumnIndex(reorderedIds[i].replace(uid, ""))]);
                }
                setColumns(reorderedColumns);

                trigger(grid.onColumnsReordered, { grid: grid });
                e.stopPropagation();
                setupColumnResize();
            }
        });
    }

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
        { id: "title", name: "Titel", field: "title", width: 120, cssClass: "cell-title", editor: Slick.Editors.Text, validator: requiredFieldValidator ,sortable: true },
        { id: "desc", name: "Beschreibung", field: "description", width: 200, editor: Slick.Editors.LongText },
        { id: "duration", name: "Duration", field: "duration", editor: Slick.Editors.Text,sortable: true  },
        { id: "%", name: "% Complete", field: "percentComplete", width: 180, resizable: false, formatter: Slick.Formatters.PercentCompleteBar, editor: Slick.Editors.PercentComplete ,sortable: true },
        { id: "start", name: "Start", field: "start", minWidth: 160, editor: Slick.Editors.Date },
        { id: "finish", name: "Finish", field: "finish", minWidth: 160, editor: Slick.Editors.Date },
        { id: "effort-driven", name: "Effort Driven", width: 180, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "effortDriven", formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox }
    ];
    var options = {
        editable: true,
        enableAddRow: true,
        enableCellNavigation: false,
        asyncEditorLoading: false,
        autoEdit: true,
        enableColumnReorder: false
    };

    $(function () {
        for (var i = 0; i < 50000; i++) {
            var d = (data[i] = {});

            d["title"] = "Task " + i;
            d["description"] = "This is a sample task description.\n  It can be multiline";
            d["duration"] = Math.round(Math.random() * 100) + " days";
            d["percentComplete"] = Math.round(Math.random() * 100);
            d["start"] = "01/01/2009";
            d["finish"] = "01/05/2009";
            d["effortDriven"] = (i % 5 == 0);
        }

        grid = new Slick.Grid($("#Absatz4"), data, columns, options);

        grid.setSelectionModel(new Slick.CellSelectionModel());

        grid.onAddNewRow.subscribe(function (e, args) {
            var item = args.item;
            grid.invalidateRow(data.length);
            data.push(item);
            grid.updateRowCount();
            grid.render();
        });
        grid.onSort.subscribe(function (e, args) {
            currentSortCol = args.sortCol;
            isAsc = args.sortAsc;
            grid.invalidateAllRows();
            grid.render();
          });
    })
    $('.ui-tabs li:first').css('margin-left','32px')
    $('.ui-tabs li:first').prepend('<img src="./images/kolibri.png" width="30" />')

};

window.onload = onLoad;
