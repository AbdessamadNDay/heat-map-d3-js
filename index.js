const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
fetch(url)
    .then(response => response.json())
    .then(data => {
        //setting the svg
        const w = 1200, h = 500, padding = 100;
        const min = d3.min(data.monthlyVariance, d => d.variance + 8.66);
        const max = d3.max(data.monthlyVariance, d => d.variance + 8.66);

        function sub183Day(date) {
            return date.setDate(date.getDate() - 2);
        }

        const svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        //setting the scales:const xScale = d3.scaleTime()
        console.log(data.monthlyVariance);
        console.log(d3.min(data.monthlyVariance, d => new Date(d.year, 0)));
        const xScale = d3.scaleTime()
            .domain([sub183Day(new Date(d3.min(data.monthlyVariance, d => new Date(d.year, 0)))), sub183Day(new Date(d3.max(data.monthlyVariance, d => new Date(d.year, 0))))])
            .range([padding, w - padding]);
        const yScale = d3.scaleTime()
            .domain([(new Date(0, 0)).setDate(new Date(0, 0).getDate() - 15), (new Date(0, 11)).setDate(new Date(0, 11).getDate() + 15)])
            .range([padding, h - padding]);
        //setting the color scale:
        var myColor = d3.scaleQuantize().domain([min, max])
            .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
        // var myColor = d3.scaleSequential().domain([d3.min(data.monthlyVariance, d => d.variance + 8.66), d3.max(data.monthlyVariance, d => d.variance + 8.66)])
        //     .interpolator(d3.schemeRdYlBu(0.5));
        // console.log([d3.min(data.monthlyVariance, d => d.variance + 8.66), d3.max(data.monthlyVariance, d => d.variance + 8.66)]); //return      [1.6840000000000002, 13.888]

        // svg.append("rect").style('fill', myColor(8)).attr("width", 80).attr("height", 80);
        // setting the axises;
        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("id", 'x-axis')
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .call(xAxis);
        //             xAxis.selectAll('line')
        //   .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px'});

        const yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("id", 'y-axis')
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis.tickFormat(d3.timeFormat("%B")));

        // tooltip 
        const tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .attr('class', "tooltip")
            .style("opacity", 100);
        //setting the rects
        const wRect = xScale(new Date(5, 0)) - xScale(new Date(4, 0));
        console.log(' this is the wRect' + wRect);
        const hRect = (h - 2 * padding) / 12;
        //test data 
        // testData = data.monthlyVariance.filter(elem => {
        //     return (elem.year === 1760 || elem.year === 1761)
        // });
        // console.log('this test data: ', testData);
        svg.selectAll("rect")
            .data(data.monthlyVariance)
            .enter()
            .append("rect")
            .attr("class", 'cell')
            .attr("data-month", d => d.month)
            .attr("data-year", d => d.year)
            .attr("data-temp", d => d.variance + 8.66)
            .attr("width", xScale(new Date(5, 0)) - xScale(new Date(4, 0)))
            .attr("height", hRect)
            .attr("x", d => {
                const daa = new Date(d.year, 0);
                return xScale(daa) - (wRect / 2) + 0.2;
            })
            .attr("y", d => {
                const daa = new Date(0, d.month - 1);
                return yScale(daa.setDate(daa.getDate() - 15));
            })
            .style("fill", d => myColor(d.variance + 8.66))
            .on("mouseover", (e, d) => {
                // console.log(e.target.getAttribute("data-xvalue"));
                tooltip.transition().duration(50).style("opacity", 0.7);
                tooltip.html(d.month + ' - ' + d.year + '<br>' + (d.variance + 8.66) + '&#8451 ' + '<br>' + d.variance + '&#8451 ')
                    .style("left", (e.clientX) + "px")
                    .style("top", (e.clientY) + "px");
                tooltip.attr("data-year", e.target.getAttribute("data-year")).style("background", 'lightsteelblue');
            }).on("mouseout", (d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        //setting the legend:
        const legendData = [];
        let i = 0;
        do {
            legendData.push(min + i * (max - min) / 11);
            i++;
        } while (legendData[legendData.length - 1] <= max);
        console.log(legendData);

        //legend xscale:
        const legend = svg.append("g").attr("id", 'legend');
        const legendScale = d3.scaleLinear()
            .domain([min, max])
            .range([padding, ((w - 2 * padding) / 2) * (1 - 0.2)])
        //legend xAxis:
        const legendAxis = d3.axisBottom(legendScale);
        legend.append("g")
            .attr("id", 'legend-axis')
            .attr("transform", "translate(0, " + (h - (padding / 3)) + ")")
            .call(legendAxis);

        const legendRectW = (max - min) / legendData.length;
        legend.selectAll("rect")
            .data(legendData)
            .enter()
            .append("rect")
            .attr("width", (legendScale(max) - legendScale(min)) / legendData.length)
            .attr("height", 30)
            .attr("x", (d, i) => legendScale(min + legendRectW * i))
            .attr("y", (h - (padding / 3)) - 30)
            .attr("fill", d => myColor(d));
        // legend.selectAll("rect").data(legendData).enter().append("rect").
    });
