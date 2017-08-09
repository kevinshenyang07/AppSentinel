const generateData = period => {
  const ratings = { day: 0.18, week: 0.13, month: 0.15 };
  const newarcsdata = [0.2, 0.2, 0.2, 0.2, 0.2];
  const newneedledata = [ratings[period]];
  return [newneedledata, newarcsdata];
};

const CreateGauge = (id) => {
  // geometry
  const margin = { top: 20, right: 10, bottom: 25, left: 10 };
  const width = $(id).width();
  const height = $(id).height();
  let r = (width) / 2;
  // aesthetic
  const colors = ["#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"].reverse();
  const angleScale = d3.scaleLinear().domain([0, 5]).range([-90, 90]);

  const svg = d3.select(id).append("svg")
            .attr("width", width)
            .attr("height", height)

  const arc = d3.arc().innerRadius(r * 4.5 / 8).outerRadius(r * 0.9);
  const innerArc = d3.arc().innerRadius(r * 3 / 8).outerRadius(r * 0.6);
  const pie = d3.pie().startAngle( -Math.PI / 2 ).endAngle( Math.PI / 2 )
                .sort(null).value(d => d);

  let data = generateData('day');
  const arcs = svg.selectAll('g.slice').data(pie(data[1]))
                  .enter().append("svg:g").attr('class', 'slice');

  arcs.append('svg:path').attr("d", arc)
      .attr("width", width).attr("height", height)
      .attr("transform", "translate(" + (r - margin.left) + "," + (height - margin.bottom) + ")")
      .style("fill", (d, i) => colors[i]);

  const labels = [1, 2, 3, 4, 5];
  arcs.append("svg:text")
      .attr("text-anchor", "middle")
      .attr("transform", function(d, i) {
        let x = innerArc.centroid(d)[0] + r - margin.left + 4 + 9 * i;
        if (i === 3) x -= 14;
        if (i === 4) x -= 32;
        const y = innerArc.centroid(d)[1] + height - margin.bottom - 15 + 10 * i;
        return "translate(" + [x, y] + ")";
      })
      .style("fill", "grey")
      .text((d, i) => labels[i]);

  // set needle initial attributes
  const needle = svg.selectAll(".needle").data(data[0])
      .enter().append('path').classed('needle', true)
      .attr('d', ['M0 -1', 'L0.03 0', 'A 0.03 0.03 0 0 1 -0.03 0', 'Z'].join(' '))
      .attr( "transform", placeNeedle);

  handleClick('button-day');
  handleClick('button-week');
  handleClick('button-month');

  function placeNeedle(d) {
    r = 180 * d / data[1][3] - 90;
    return "translate(" + (width / 2 - margin.left) + "," + (height - margin.bottom) + ") "
      + "rotate(" + r + ") "
      + "scale(" + (width * 0.85 / 2) + ")";
  }

  // method to update needle attributes
  function handleClick(buttonId) {
    const period = buttonId.split("-")[1];
    d3.select("#" + buttonId)
    .on("click", function() {
      data = generateData(period);
      arcs.data(pie(data[1])).transition().attr("d", arc);
      needle.data(data[0])
            .transition().ease(d3.easeElasticOut).duration(2000)
            .attr( "transform", placeNeedle);
    });
  }
};

export const displayRating = () => {
  CreateGauge("#rating");
};
