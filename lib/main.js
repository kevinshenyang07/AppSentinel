const data = [30, 86,  168, 281, 303];

d3.select("#dashboard")
  .selectAll("div")
  .data(data)
    .enter()
    .append("div")
    .style("width", d => `${d}px`)
    .text(d => `$ ${d}`);
