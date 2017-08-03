const channelData = [
  { channel: 'Organic', platform: { iOS: 10500, Android: 15100, Desktop: 2300 } },
  { channel: 'Google', platform: { iOS: 7900, Android: 6700, Desktop: 3100 } },
  { channel: 'FB', platform: { iOS: 5700, Android: 6200, Desktop: 1100 } },
  { channel: 'AdMob', platform: { iOS: 1400, Android: 4100, Desktop:980 } },
  { channel: 'Email', platform: { iOS: 450, Android: 810, Desktop: 650 } },
  { channel: 'Referral', platform: { iOS: 2500, Android: 700, Desktop: 240 } },
];

const createView = (id, data) => {
  // geometry
  const margin = { top: 60, right: 0, bottom: 30, left: 0 };
  const width = $(id).width() - margin.right - margin.left;
  const height = $(id).height() - margin.top - margin.bottom;
  const dimension = {
    pieChart: {
      width: height,
      height,
    },
    histogram: {
      width: 300,
      height,
    },
  };
  const pieDim = dimension.pieChart;
  pieDim.radius = Math.min(pieDim.width, pieDim.height) / 2;
  // aesthetic
  const colors = { bar: 'grey', iOS: "#e08214", Android: "#14e082",
    Desktop: "#8214e0" };
  // calculate subtotals
  data.forEach(d => { d.total = d.platform.iOS + d.platform.Android
    + d.platform.Desktop; });

  // function to generate pie chart
  const createPieChart = (pData) => {
    const pC = {};
    const svg = d3.select('#channels-left').append("svg")
              .attr("width", pieDim.width)
              .attr("height", pieDim.height)
              .append("g")
              .attr("transform", "translate(" + pieDim.width / 2 + ","
                + pieDim.height / 2 + ")");

    const arc = d3.arc().outerRadius(pieDim.radius - 10).innerRadius(0);
    const pie = d3.pie().sort(null).value(d => d.platform);

    svg.selectAll("path").data(pie(pData))
       .enter().append("path")
       .attr("d", arc)
       .each(function(d) { this._current = d; })
       .style("fill", d => colors[d.data.type])
       .on("mouseover", mouseover)
       .on("mouseout", mouseout);

    pC.update = nD => {
      svg.selectAll("path").data(pie(nD))
         .transition().duration(500)
         .attrTween("d", arcTween);
    };

    function mouseover(d) {
      // call the update function of histogram with new data.
      const nD = data.map(c => [c.channel, c.platform[d.data.type]]);
      histogram.update(nD, colors[d.data.type]);
    }
             //Utility function to be called on mouseout a pie slice.
    function mouseout(d) {
      // call the update function of histogram with all data.
      histogram.update(data.map(c => [c.channel, c.total]), colors.bar);
    }

    function arcTween(a) {
      const i = d3.interpolateObject(this._current, a);
      this._current = i(0);
      return t => arc(i(t));
    }

    return pC;
  };


  // function to generate histogram
  const createHistogram = (byChannelData) => {
    const hG = {};
    const histDim = dimension.histogram;

    const svg = d3.select('#channels-right').append("svg")
        .attr("width", histDim.width + margin.left + margin.right)
        .attr("height", histDim.height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + 12) + ")");

    const x = d3.scaleBand()
            .rangeRound([0, histDim.width]).padding(0.1)
            .domain(byChannelData.map(d => d[0]));

    const y = d3.scaleLinear()
            .range([histDim.height, 0])
            .domain([0, d3.max(byChannelData, d => d[1])]);

    const xAxis = d3.axisBottom(x)

    svg.append("g").attr("class", "x axis")
       .attr("transform", "translate(0," + histDim.height + ")")
       .call(xAxis);

    const bars = svg.selectAll(".bar")
                    .data(byChannelData).enter()
                    .append("g")
                    .attr("class", "bar");

    bars.append("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => histDim.height - y(d[1]))
        .attr('fill', colors.bar)
        .on("mouseover", mouseover)
        .on("mouseout",mouseout);

    function mouseover(d) {
      const singleChannelData = data.filter(s => s.channel === d[0])[0];
      const nD = d3.keys(singleChannelData.platform).map(
        s => ({type:s, platform: singleChannelData.platform[s]})
      );
      // call update functions of pie-chart and legend.
      pieChart.update(nD);
      legend.update(nD);
    };

    function mouseout(d) {
      // reset the pie-chart and legend.
      pieChart.update(totalByPlatform);
      legend.update(totalByPlatform);
    };

    bars.append("text").text(d => d3.format(",")(d[1]))
      .attr("x", d => x(d[0]) + x.bandwidth() / 2)
      .attr("y", d => y(d[1]) - 5)
      .attr("text-anchor", "middle");

    hG.update = (nD, color) => {
      // update the domain of the y-axis map to reflect change in frequencies.
      y.domain([0, d3.max(nD, d => d[1])]);

      // Attach the new data to the bars.
      const newBars = svg.selectAll(".bar").data(nD);

      // transition the height and color of rectangles.
      newBars.select("rect").transition().duration(500)
             .attr("y", d => y(d[1]))
             .attr("height", d => histDim.height - y(d[1]))
             .attr("fill", color);

      // transition the frequency labels location and change value.
      newBars.select("text").transition().duration(500)
          .text(d => d3.format(",")(d[1]))
          .attr("y", d => y(d[1]) - 5);
    };

    return hG;
  };


  const createLegend = (lData) => {
    const leg = {};
    // compute percentage
    const getLegend = (d, aD) => {
      // console.log(d.platform / d3.sum(aD.map(c => c.platform)));
      return d3.format(".2%")(d.platform / d3.sum(aD.map(c => c.platform)));
    };

    // create table for legend.
    const legend = d3.select('#channels-left').append("table").attr('class','legend');

    // create one row per segment.
    const tr = legend.append("tbody").selectAll("tr").data(lData).enter().append("tr");

    // create the first column for each segment.
    tr.append("td").append("svg").attr("width", '16').attr("height", '16')
      .append("rect").attr("width", '16').attr("height", '16')
      .attr("fill", d => colors[d.type])
      .attr('transform', 'translate(0, 6)');

    // create the second column for each segment.
    tr.append("td").text(d => d.type);

    // create the third column for each segment.
    tr.append("td").attr("class",'legend-platform')
        .text(d => d3.format(",")(d.platform));

    // create the fourth column for each segment.
    tr.append("td").attr("class",'legend-perc')
        .text(d => getLegend(d, lData));

    // Utility function to be used to update the legend.
    leg.update = (nD) => {
      // update the data attached to the row elements.
      const rows = legend.select("tbody").selectAll("tr").data(nD);

      // update the frequencies.
      rows.select(".legend-platform").text(d => d3.format(",")(d.platform));

      // update the percentage column.
      rows.select(".legend-perc").text(d => getLegend(d, nD));
    }

    return leg;
  };

  const totalByPlatform = ["iOS", "Android", "Desktop"].map(p => (
    {type: p, platform: d3.sum(data.map(t => t.platform[p]))}
  ));

  const totalByChannel = data.map(d => [d.channel, d.total]);

  const legend = createLegend(totalByPlatform);
  const pieChart = createPieChart(totalByPlatform);
  const histogram = createHistogram(totalByChannel);

};

export const displayChannels = () => {
  createView("#channels", channelData);
};
