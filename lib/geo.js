const usersByState = [
  { state: 'CA', total: 962000, paid: 192400 },
  { state: 'NY', total: 827400, paid: 251700 },
  { state: 'TX', total: 535000, paid: 230400 },
  { state: 'PA', total: 327600, paid: 126700 },
  { state: 'MA', total: 210000, paid: 153400 },
];

const createHBars = (id, data) => {
  data.sort(function(a, b) { return a.total - b.total; });

  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const width = $(id).width() - margin.left - margin.right;
  const height = $(id).height() - margin.top - margin.bottom;

  const x = d3.scaleLinear().range([0, width])
              .domain([0, d3.max(data, d => d.total)]);
  const y = d3.scaleBand().range([height, 0])
              .domain(data.map(d => d.state)).padding(0.2);

  const xAxis = d3.axisBottom(x).ticks(5)
              .tickFormat(d => parseInt(d / 1000))
              .tickSizeInner([-height]);

  const yAxis = d3.axisLeft(y);

  const tooltip = d3.select("body").append("div").attr("class", "toolTip");

  const svg = d3.select(id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("
              + margin.left + "," + margin.top + ")"
            );

  svg.append("g")
     .attr('class', "x axis")
     .attr('transform', "translate(0," + height + ")")
     .call(xAxis);

  svg.append("g")
     .attr('class', 'y axis')
     .call(yAxis);

  svg.selectAll('.bar').data(data)
     .enter().append('rect')
     .attr('class', 'bar')
     .attr('x', 0)
     .attr("y", d => y(d.state))
     .attr("width", d => x(d.total))
     .attr("height", y.bandwidth())
     .on("mousemove", function(d) {
         const total = d3.format(',')(d.total)
         tooltip
           .style("left", d3.event.pageX - 50 + "px")
           .style("top", d3.event.pageY - 70 + "px")
           .style("display", "inline-block")
           .html(`Number of users in ${d.state}: ${total}`);
     })
     .on("mouseout", () => tooltip.style("display", "none"));

};

export const displayGeoDist = () => {
  createHBars("#geo", usersByState);
};
