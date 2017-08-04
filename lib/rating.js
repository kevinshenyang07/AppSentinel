const degToRad = deg => {
  return deg * Math.PI / 180;
};

const generateData = () => {
  const newarcsdata = [0.2, 0.2, 0.2, 0.2, 0.2];
  const newneedledata = [d3.randomUniform(0.12, 0.2)()];
  return [newneedledata, newarcsdata];
};

const CreateGauge = (id) => {
  // geometry
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = $(id).width();
  const height = $(id).height();
  let r = width / 2;
  // aesthetic
  const colors = ["#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"].reverse();
  const angleScale = d3.scaleLinear().domain([0, 5]).range([-90, 90]);

  const svg = d3.select(id).append("svg")
            .attr("width", width)
            .attr("height", height)

  debugger;
  svg.append('g').classed('axis', true)
    .call(d3AxisRadialOuter(
        angleScale.copy().range(angleScale.range().map(degToRad)),
        r - 5
  ));

  const arc = d3.arc().innerRadius(width * 5 / 16).outerRadius(width / 2).padAngle(0);
  const pie = d3.pie().startAngle( -Math.PI / 2 ).endAngle( Math.PI / 2 )
                .sort(null).value(d => d);

  let data = generateData();
  const arcs = svg.selectAll('.arc').data(pie(data[1]))
                  .enter().append('path')
                  .attr("d", arc)
                  .attr("width", width).attr("height", height)
                  .attr("transform", "translate(" + width / 2 + "," + (height - margin.bottom) + ")")
                  .style("fill", (d, i) => colors[i]);

  const needle = svg.selectAll(".needle").data(data[0])
      .enter().append('path').classed('needle', true)
      .attr('d', ['M0 -1', 'L0.03 0', 'A 0.03 0.03 0 0 1 -0.03 0', 'Z'].join(' '))
      .attr( "transform", function(d) {
        r = 180 * d / data[1][3] - 90;
        return "translate(" + width / 2 + "," + (height - margin.bottom) + ") "
          + "rotate(" + r + ") "
          + "scale(" + (height / 2) + ")";
        }
      );

  d3.select( "#button" )
  .on("click", function() {
    data = generateData();
    arcs.data(pie(data[1])).transition().attr("d", arc);
    needle.data(data[0])
          .transition().ease(d3.easeElasticOut).duration(2000)
          .attr( "transform", function(d) {
            r = 180 * d / data[1][3] - 90;
            return "translate(" + width / 2 + "," + (height - margin.bottom) + ") "
              + "rotate(" + r + ")"
              + "scale(" + (height / 2) + ")";
          });
   });

};

export const displayRating = () => {
  CreateGauge("#rating");
};
