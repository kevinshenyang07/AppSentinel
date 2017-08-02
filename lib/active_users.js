const generateActiveUserNumbers = time => {
  const base = 50000;
  return {
    'time': time,
    'DAU': Math.floor(base * (1 + (Math.random() - 0.5) * 0.25)),
    'WAU': Math.floor(base * 2 * (1 + (Math.random() - 0.5) * 0.25)),
    'MAU': Math.floor(base * 5 * (1 + (Math.random() - 0.5) * 0.25)),
  };
};

const generate = (data, id, axisNum) => {

  // get data prepared
  const parseTime = d3.timeParse("%H:%M");
  const formatNumber = d3.format(".0s");

  // calculate chart size based on window size
  const margin = {top: 20, right: 15, bottom: 50, left: 15};
  const width = $(id).width() - margin.left - margin.right;
  const height = $(id).height() - margin.top - margin.bottom;

  // map time str to time object
  const ddata = data.map((ele, i) => ({
    'time': parseTime(ele['time']),
    'DAU': ele['DAU'],
    'WAU': ele['WAU'],
    'MAU': ele['MAU']
  }));

  // set the range and scale the range to data
  const x = d3.scaleTime().range([0, width])
              .domain(d3.extent(ddata, d => d.time));
        // extent returns [min, max]
  const yRange = d3.extent(ddata, d => d['DAU']);
  const y = d3.scaleLinear().range([height, 0])
              .domain([yRange[1] / 2, yRange[1]]);

  // defined axes
  const xAxis = d3.axisBottom(x)
      .ticks(d3.timeMinute.every(Math.floor(data.length / axisNum)))
      .tickSize(-height)
      .tickPadding([6]);

  const yAxis = d3.axisLeft(y)
      .ticks(10)
      .tickSize(-width)
      .tickFormat(formatNumber);

  // define the plotting
  const area = d3.area()
      .curve(d3.curveCardinal)
      .x(d => x(d.time))
      .y0(height)
      .y1(d => y(d["DAU"]));

  // remove previous element
  d3.select('.active-users').remove();

  // define svg
  const svg = d3.select(id).append("svg")
      .attr("id", "svg-active-users")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
     .attr("class", "x axis")
     .attr("id", "active-users-x-axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "y axis")
     .call(yAxis);

  const path = svg.append("svg:path")
      .datum(ddata)
      .attr("class", "areaM")
      .attr("d", area);

  const points = svg.selectAll(".gPoints")
      .data(ddata)
      .enter().append("g")
      .attr("class", "gPoints");

  //legend rendering
  const legendSize = 8;
  const legendColor = 'rgba(0, 160, 233, 0.7)';

  const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform',
        'translate(0,' + (height + margin.bottom - legendSize) +')'
      );

  legend.append('rect')
      .attr('width', legendSize)
      .attr('height', legendSize)
      .attr('transform', 'translate(0, -5)')
      .style('fill', legendColor);

  legend.append('text')
      .data(ddata)
      .attr('x', legendSize * 1.2)
      .attr('y', legendSize / 2)
      .text('Daily Active Users');

  points.selectAll(".usertipPoints")
      .data(ddata)
      .enter().append("circle")
      .attr("class", "usertipPoints")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d['DAU']))
      .attr("r", "6px");

  const axisOpt = { x, y, xAxis, width, height };
  const svgAttr = { svg, points, area, path };

  debugger;
  return { axisOpt, svgAttr };
};

const redraw = (data, id, x, y, xAxis, svg, area, path, points, height, axisNum) => {
  //format of time data
  var parseTime = d3.timeParse("%H:%M");
  var formatNumber = d3.format(".0%");

  const ddata = data.map((ele, i) => ({
    'time': parseTime(ele['time']),
    'DAU': ele['DAU'],
    'WAU': ele['WAU'],
    'MAU': ele['MAU']
  }));

  x.domain(d3.extent(ddata, d => d.time));

  xAxis.ticks(d3.timeMinute.every(Math.floor(data.length / axisNum)))

  svg.select("#active-users-x-axis")
      .transition()
      .duration(200)
      .ease(d3.easeSin)
      .call(xAxis);

  //area line updating
  path.datum(ddata)
      .transition()
      .duration(200)
      .attr("class", "areaM")
      .attr("d", area);

  //circle updating
  points.selectAll(".usertipPoints")
      .data(ddata)
      .attr("class", "usertipPoints")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d['DAU']))
      .attr("r", "6px");

  //draw new dot
  points.selectAll(".usertipPoints")
      .data(ddata)
      .enter().append("circle")
      .attr("class", "usertipPoints")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d['DAU']))
      .attr("r", "6px");

  //remove old dot
  points.selectAll(".usertipPoints")
      .data(ddata)
      .exit()
      .transition()
      .duration(200)
      .remove();
};

//dynamic data and chart update
export const displayActiveUsers = () => {
  const minutes = ['10:01', '10:02', '10:03', '10:04',
    '10:05', '10:06', '10:07', '10:08', '10:09'];

  const activeUserData = minutes.map(m => generateActiveUserNumbers(m));

  const categories = ['Daily Active Users', 'Weekly Active Users',
    'Monthly Active Users'];

  let hAxis = 10;
  let mAxis = 10;

  var sca = new generate(activeUserData, "#active-users", 8);

  setInterval(() => {
    //update donut data
    activeUserData.push(generateActiveUserNumbers(hAxis + ":" + mAxis));

    if(mAxis === 59) {
      hAxis++;
      mAxis=0;
    }
    else {
      mAxis++;
    }

    if (Object.keys(activeUserData).length === 20) activeUserData.shift();

    redraw(
      activeUserData, ".active-users", sca.axisOpt['x'], sca.axisOpt['y'],
      sca.axisOpt['xAxis'], sca.svgAttr['svg'], sca.svgAttr['area'],
      sca.svgAttr['path'], sca.svgAttr['points'], sca.axisOpt['height'], 8
    );

    // debugger;
  }, 4000);
};
