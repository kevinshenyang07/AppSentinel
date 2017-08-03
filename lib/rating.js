const generateData = () => {
  const newarcsdata = [0.2, 0.2, 0.2, 0.2, 0.2];
  const newneedledata = [d3.randomUniform(0.12, 0.2)()];
  return [newneedledata, newarcsdata];
};

const CreateGauge = (id) => {
  // geometry
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = $(id).width() - margin.left - margin.right;
  const height = $(id).height() - margin.top - margin.bottom;
  // aesthetic
  const colors = ["#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"].reverse();

  const svg = d3.select(id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

  const arc = d3.arc().innerRadius(100).outerRadius(160).padAngle(0);
  const pie = d3.pie().startAngle( -Math.PI / 2 ).endAngle( Math.PI / 2 )
                .sort(null).value(d => d);

  let data = generateData();
  const arcs = svg.selectAll('.arc').data(pie(data[1]))
                  .enter().append('path')
                  .attr("d", arc)
                  .attr("width", width).attr("height", height)
                  .attr("transform", "translate(160, 160)")
                  .style("fill", (d, i) => colors[i]);

  const needle = svg.selectAll(".needle").data( data[0] )
                    .enter().append('line')
                    .attr("x1", 0).attr("x2", -150)
                    .attr("y1", 0).attr("y2", 0)
                    .style( "stroke", "black" )
                    .attr( "transform", function( d ) {
                      const r = 180 * d / data[ 1 ][ 3 ];
                      return " translate(160, 160) rotate(" + r + ")";
                    } );

  d3.select( "#button" )
  .on( "click", function() {
    data = generateData();
    arcs.data(pie(data[1])).transition().attr( "d", arc );
    needle.data(data[0])
          .transition().ease( d3.easeElasticOut ).duration( 2000 )
          .attr( "transform", function( d ) {
            const r = 180 * d / data[1][3];
            return " translate(160,160) rotate(" + r + ")";
          });
   });

};

export const displayRating = () => {
  CreateGauge("#rating");
};
