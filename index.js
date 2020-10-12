var margin = {
        top: 20,
        right: 20,
        left: 20,
        bottom: 20
    },
    width = 810,
    height = 640;

var chart = d3.select(".ecv_chart")
    .attr("viewBox", "0 0 " + width + " " + height)

var wrapper = chart.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("transform", "translate(50,100)")


d3.csv("data/ecv_margin_histo_chart.csv").then(function (data) {
    data.forEach(function (d) {
        d.ecvs = +d.ecvs;
        d.margin = +d.margin;
        d.abs_margin = +d.abs_margin;
    });

    // stack bars next to each other
    data.reduce((acc, cur) => {
        cur.start = acc;
        return acc + (cur.ecvs);
    }, 0);

    //get bars for both parties to start from x(0)
    data.forEach(function (d) {
        if (d.party == 'D') {
            d.start = d.start - 305
        }
    })

    var x = d3.scaleLinear()
        .domain([0, 310])
        .range([0, 620]);


    var y = d3.scaleLinear()
        .domain([-80, 50])
        .range([310, 0]);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(5);

    wrapper.append("g")
        .attr("class", "yAxis")
        .call(yAxis);


    var grid = d3.axisRight()
        .tickFormat("")
        .tickSize(width - 140)
        .scale(y)
        .tickValues([-80, -60, -40, -20, 0, 20, 40]);

    wrapper.append("g")
        .attr("class", "grid")
        .call(grid);

    wrapper.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", function (d) {
            if (d.margin < 0) {
                return "#25428f";
            } else {
                return "#cc0a11";
            }
        })
        .style("stroke", "#FBF6EF")
        .attr("stroke-width", 0.1)
        .attr("width", function (d) {
            return (x(d.ecvs))
        })
        .attr("height", function (d) {
            if (d.margin > 0) {
                return y(0) - y(d.margin);
            } else {
                return -(y(0) - y(d.margin));
            }
        })
        .attr("y", function (d) {
            if (d.margin > 0) {
                return (y(d.margin));
            } else {
                return (y(0));
            }
        })
        .attr("x", function (d, i) {
            return x(d.start);
        })

    wrapper.append("line")
        .attr("y1", y(-80))
        .attr("y2", y(40))
        .attr("x1", x(270))
        .attr("x2", x(270))
        .style("stroke-width", "1.5")
        .style("stroke", "#121212")
        .attr("class", "zero-line");
});