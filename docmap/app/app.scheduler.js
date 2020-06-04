
const H = 15;
const MIN = 60 * 24;
const NOW = new Date().getMinutes() + new Date().getHours() * 60;
const TODAY = (new Date().getDay()+6)%7;

function toProz(foo) { return foo * 100 / MIN + '%'; }
const labels = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

const Scheduler = function () {
    function hh_to_x(d) {
        return d * 60 / MIN * 100 + '%';
    }
    var tooltip = d3.select("body")
        .append("div")
        .attr("id", "mytooltip")
        .style("position", "absolute")
        .style("z-index", "9999")
        .style("visibility", "hidden")
        .style("padding", "3px")
        .style('background',COLOR1)
        .style('color','white')
        .text("a simple")
        ;
    console.log('START SVG WORK')
    const svg = d3.selectAll("svg[data-schema]")
        .datum(function (d,i) {
           
            console.log('##### ' + i )
            const schema = JSON.parse(this.getAttribute('data-schema').b64_to_utf8())
            console.log(schema)
            const res = schema.map(function (schema, i) {
                return {
                    label: labels[i],
                    schema: schema
                }
            });
            console.log(res);
            return res;
        })
        .style('height', 7 * H + 10)
        .on("mouseover", function () { 
            const d =d3.event.target.__data__;
            if (!d.start) return;
            const text = d.start.minsToHHMM() + ' – ' + d.stop.minsToHHMM()  + ' Uhr';
            return tooltip.style("visibility", d.start ?"visible":'hidden').text(text); })
        .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); })
        .style('margin', 0);

    // vertical line every hour
    svg.selectAll('line')
        .data([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
        .enter()
        .append('line')
        .attr('x1', hh_to_x)
        .attr('x2', hh_to_x)
        .attr('y1', 0)
        .attr('y2', H * 6.5)
        .attr('stroke-linecap', "round")
        .attr('stroke-dasharray', "2,2")
        .style('stroke', function hh_to_stroke(d) {
            return (d > 6 && d % 3 == 0) ? '#333' : '#ccc';
        })
        .style('stroke-width', 1.0)

    // hour label for every fat hour
    svg.selectAll('text.legende')
        .data([9, 12, 15, 18])
        .enter().append('text')
        .attr('x', function (d) {
            return (d > 6 && d % 3 == 0) ? (d * 60 / MIN * 100) - 2.5 + '%' : '';
        })
        .attr('y', 110)
        .attr('font-family', "Roboto, Arial, sans-serife")
        .attr('font-size', "10.0px")
        .attr('fill', "#333")
        .text(function (d) { return (d * 60).minsToHHMM() })


    svg.selectAll('text.weekday')
        .data(function (d) {
            return d;
        })
        .enter()
        .append('text')
        .classed('weekday', true)
        .text(function (d, i) {
            return d.label;
        })
        .attr('font-family', "Roboto, Arial, sans-serife")
        .attr('font-size', "10.0px")
        .attr('opacity', function (d, i) {
            return (new Date().getDay() + 6) % 7 == i ? 1 : 0.6;
        })
        .attr('fill', "#333")
        .attr('x', 0)
        .attr('y', function (d, i) {
            return H * i + 0.5 * H
        })
        ;

    svg.selectAll('rect')
        .data(function () {
            var res = [];
            this.__data__.forEach(function (d, wd) {
                d.schema && d.schema.forEach(function (oh) {
                    res.push({
                        wd: wd,
                        start: oh[0],
                        stop: oh[1]
                    });
                })
            });
            //console.log(res)
            return res;
        })
        .enter()
        .append('rect')
        .classed('openinghours', true)
        .attr('x', function (d) {
            return toProz(d.start)
        })
        .attr('y', function (d) {
            return d.wd * H;
        })
        .attr('width', function (d) {
            return toProz(d.stop - d.start)
        })
        .attr('height', function (d) {
            return H - 1
        })       
        .attr('fill', function (d) {
            console.log(d)
            return (NOW > d.start && NOW < d.stop && d.wd == TODAY) ? COLOR1 : COLOR2
        });
    svg.selectAll('text.here')
        .data([0])
        .enter()
        .append('text')
        .text('⧫')
        .attr('x', toProz(NOW-20))
        .attr('y', TODAY * H + 0.76 * H)
        .attr('font-size', H + "px")
        .attr('fill', 'red')
        .attr('title', 'So spät ist es.');


};

